Page({
    data: {
        imagePath: '',
        ocrResult: []
    },

    onLoad() {
        this.requestCameraPermission();
    },
    requestCameraPermission() {
        wx.authorize({
            scope: 'scope.camera',
            success() {
                console.log('摄像头权限已开启');
            },
            fail() {
                wx.openSetting({
                    success(settingdata) {
                        if (settingdata.authSetting['scope.camera']) {
                            console.log('用户在设置中开启了摄像头权限');
                        } else {
                            console.log('用户拒绝开启摄像头权限');
                            wx.showToast({
                                title: '需要开启摄像头权限',
                                icon: 'none'
                            });
                        }
                    }
                });
            }
        });
    },

    // 拍照并识别
    takePhoto() {
        wx.chooseImage({
            count: 1, // 默认为 1
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                const tempImagePath = res.tempFilePaths[0];
                this.setData({ imagePath: tempImagePath });

                // 读取图片为 ArrayBuffer
                wx.getFileSystemManager().readFile({
                    filePath: tempImagePath,
                    success: (fileRes) => {
                        console.log("success ", fileRes.data.slice.length);
                        const arrayBuffer = fileRes.data;
                        this.runVKOCR(arrayBuffer);
                    },
                    fail: (err) => {
                        console.error('读取图片失败', err);
                    }
                });
            },
            fail: (err) => {
                console.error('拍照失败', err);
            }
        });
    },

    // 使用 VisionKit OCR 识别文字
    runVKOCR(arrayBuffer:string | ArrayBuffer) {
        console.log("ocr1")
        const session = wx.createVKSession({
            track: {
                OCR: { mode: 2 } // 图片识别模式
            }
        });
        console.log("ocr2",this.data.imagePath)
        console.log('VKSession 是否存在', session);
        // 获取图片信息（宽高）
        wx.getImageInfo({
            src: this.data.imagePath,
            success: (info) => {
                console.log("ocr3",info)
                session.runOCR({
                    frame: {
                        data: arrayBuffer,
                        width: info.width,
                        height: info.height
                    }
                }, (res:any) => {
                    console.log('OCR 识别结果：', res);
                    if (res && res.objects) {
                        this.setData({
                            ocrResult: res.objects
                        });
                    } else {
                        // wx.showToast({
                        //     title: '未识别到文字',
                        //     icon: 'none'
                        // });
                    }
                });
                console.log("ocr over")
            },
            fail: (err) => {
                console.error('获取图片宽高失败', err);
                // wx.showToast({
                //     title: '获取图片宽高失败',
                //     icon: 'none'
                // });
            }
        });
    }
});