// pages/index/index.js
import WxTouch from "../../utils/wx-touch.js";
let globalData = getApp().globalData;
let store = {};

let baseUrl = "https://www.91shoujike.com/phoneModelResources";

Page({
    data: {
        phoneId: 0,
        phoneName: "",
        maskImg: "",
        maskWidth: 0,
        maskHeight: 800,
        maskRadius: 0,
        maskSizeRatio: 1,
        shapes: [],
        width: 0,
        height: 0,
        deltaX: 0,
        deltaY: 0,
        angle: 0,
        scale: 1,
        direction: ""
    },

    onLoad: function(options) {
        // console.log(options);
        var thisPage = this;
        wx.showLoading({
            title: "加载中"
        });

        options.phoneId = 10003;
        options.phoneName = "iPhone 6";

        thisPage.setData({
            phoneId: options.phoneId,
            phoneName: options.phoneName,
        });
        
        wx.request({
            url: baseUrl + "/"+options.phoneId+"/data.json",
            data: {
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    thisPage.setMaskInfo(res.data.phone_res);
                    thisPage.setMaskImg(baseUrl + "/"+options.phoneId+"/" + res.data.material_res.material_cover_img);
                    thisPage.setShapes(res.data.phone_res.shapes);
                }
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        var e = [ "../../images/assets/1-3.jpg", "../../images/assets/1-4.jpg", "../../images/assets/1-5.jpg", "../../images/assets/1-6.jpg" ], s = e[Math.floor(Math.random() * e.length)];
        return "button" === t.from && a.aldstat.sendEvent("点击直接分享按钮", {
            "分享按钮": "点击直接分享按钮"
        }), {
            title: "定义你的手机壳打开脑洞、创作独一无二的作品",
            path: "/pages/index/index",
            imageUrl: s
        };
    },

    chooseImg: function () {
        var thisPage = this;
        wx.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"],
            success: function (imgs) {
                wx.getImageInfo({
                    src: imgs.tempFilePaths[0],
                    success: function (imgInfo) {
                        thisPage.setPhotoSize(imgInfo);
                    }
                });
                thisPage.setData({
                    photo: imgs.tempFilePaths[0],
                });

                // wx.previewImage({
                //     urls: [ imgs.tempFilePaths[0] ],
                //     current: imgs.tempFilePaths[0]
                // });
            }
        });
    },

    setMaskImg: function(maskImgUrl) {
        var thisPage = this;
        wx.downloadFile({
            url: maskImgUrl,
            success: function(res) {
                if (200 === res.statusCode) {
                    thisPage.setData({
                        maskImg: res.tempFilePath
                    });
                }
            },
            fail: function(t) {
                wx.showToast({
                    title: "下载资源失败，稍后再试",
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },

    setMaskInfo: function(phoneInfo) {
        var thisPage = this;
        var sizeRatio = thisPage.data.maskHeight / phoneInfo.phoneH;
        var maskWidth = phoneInfo.phoneW * sizeRatio;
        var maskRadius = phoneInfo.corner_radius * sizeRatio;

        thisPage.setData({
            // phoneId: phoneInfo.phoneId,
            // phoneName: phoneInfo.phoneName,
            maskWidth: maskWidth,
            maskRadius: maskRadius,
            maskSizeRatio: sizeRatio,
        });
        
    },

    setShapes: function(shapeList) {
        var thisPage = this;
        var shapesTmp = [];
        shapeList.forEach(function(shapeInfo) {
            wx.downloadFile({
                url: baseUrl + "/"+thisPage.data.phoneId+"/" + shapeInfo.url,
                success: function(res) {
                    // console.log(shapeInfo);
                    if (200 === res.statusCode) {
                        shapeInfo.path = res.tempFilePath;
                        shapesTmp.push(shapeInfo);
                        thisPage.setData({
                            shapes: shapesTmp
                        })
                    }
                },
                fail: function(res) {
                    wx.showToast({
                        title: "下载资源失败，请稍后再试",
                        icon: "none",
                        duration: 2e3
                    });
                }
            });
        });
    },

    setPhotoSize: function (imgInfo) {
        var thisPage = this;
        var photoWidthInit = 0;
        var photoHeightInit = 0;
        if ((imgInfo.width / imgInfo.height) <= (thisPage.data.maskWidth / thisPage.data.maskHeight)) {
            photoWidthInit = thisPage.data.maskWidth;
            photoHeightInit = thisPage.data.maskWidth / (imgInfo.width / imgInfo.height);
        } else {
            photoWidthInit = thisPage.data.maskHeight * (imgInfo.width / imgInfo.height);
            photoHeightInit = thisPage.data.maskHeight;
        }
        photoWidthInit = photoWidthInit * 1.1;
        photoHeightInit = photoHeightInit * 1.1;
        thisPage.setData({
            width: photoWidthInit,
            height: photoHeightInit,
            deltaX: (photoWidthInit - thisPage.data.maskWidth) / -2 * globalData.rpxRatio,
            deltaY: (photoHeightInit - thisPage.data.maskHeight) / -2 * globalData.rpxRatio,
        });
    },

    ...WxTouch("Touch", {

        touchstart(evt) {

            // 保存已经存在的数据
            store.deltaX = this.data.deltaX;
            store.deltaY = this.data.deltaY;
            store.angle = this.data.angle;
            store.scale = this.data.scale;

            this.setData({
                transition: "none"
            })
        },

        touchmove(evt) {
            let undef, data = {};

            console.log(evt.deltaX);

            if (evt.deltaX !== undef) {
                data.deltaX = evt.deltaX;
                data.deltaY = evt.deltaY;
            }

            if (evt.angle !== undef) {
                // data.angle = evt.angle;
            }

            if (evt.scale !== undef) {
                data.scale = evt.scale;
            }

            console.log(this);

            // 一次性调用 setData
            this.setData(data);
        },

        touchend(evt) {

            // 针对 pressmove 事件，保存已经平移的距离
            if (evt.touches.length) {
                store.deltaX = this.data.deltaX;
                store.deltaY = this.data.deltaY;
            }
        },

        swipe(evt) {
            this.setData({
                direction: evt.direction
            })
        },

        pressmove(evt) {

            // 仅仅设置数据，统一到 touchmove 处理器中调用 setData
            evt.deltaX += store.deltaX;
            evt.deltaY += store.deltaY;
        },

        rotate(evt) {

            // 仅仅设置数据，统一到 touchmove 处理器中调用 setData
            evt.angle += store.angle;
        },

        pinch(evt) {
            
            // 仅仅设置数据，统一到 touchmove 处理器中调用 setData
            evt.scale *= store.scale;
        },

        doubletap(evt) {
            this.setData({
                transition: "all 0.3s",
                scale: this.data.scale >= 1.3 ? 1 : 1.3
            })
        }
    })
})
