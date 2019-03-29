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
        canvasWidth: 0,
        canvasHeight: 0,
        photo: "",
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
            maskWidth: maskWidth,
            maskRadius: maskRadius,
            maskSizeRatio: sizeRatio,
            canvasWidth: (5 * maskWidth + 88) / 2, //88
            canvasHeight: (5 * thisPage.data.maskHeight + 88) / 2, //88
        });
        
    },

    setShapes: function(shapeList) {
        console.log(shapeList);
        var thisPage = this;
        var shapesTmp = [];
        var y0 = 0;
        shapeList.forEach(function(shapeInfo, index) {
            if (index == 0) {
                y0 = shapeInfo.y;
            } 
            if (index == 1) {
                shapeInfo.y = parseFloat(y0) + 0.1;
            }
            wx.downloadFile({
                url: baseUrl + "/"+thisPage.data.phoneId+"/" + shapeInfo.url,
                success: function(res) {
                    console.log(shapeInfo);
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

    setPhone: function() {
        wx.redirectTo({
            url: "../../pages/selectPhone/selectPhone"
        });
    },

    draw: function() {
        var thisPage = this;
        if ("" != this.data.photo) {
            wx.showLoading({
                title: "正在生成作品"
            });
            var myCanvas = wx.createCanvasContext("myCanvas", this);
            var drawLeft = 5 * this.data.deltaX + 22; //22
            var drawTop = 5 * this.data.deltaY + 22; //22
            var dWidth = (5 * this.data.width) / 2;
            var dHeight = (5 * this.data.height) / 2;
            var dx = drawLeft - (dWidth * this.data.scale - dWidth) / 2;
            var dy = drawTop - (dHeight * this.data.scale - dHeight) / 2;


            myCanvas.save();
            myCanvas.translate(drawLeft + dWidth / 2, drawTop + dHeight / 2);
            myCanvas.rotate(this.data.angle * Math.PI / 180);
            myCanvas.translate(-(drawLeft + dWidth / 2), -(drawTop + dHeight / 2));
            myCanvas.drawImage(this.data.photo, dx, dy, dWidth * this.data.scale, dHeight * this.data.scale);

            // console.log(this.data.deltaX);
            // console.log(this.data.deltaY);
            // console.log({dx, dy});

            // console.log(this.data.width);
            // console.log(this.data.height);
            // console.log(dWidth * this.data.scale);
            // console.log(dHeight * this.data.scale);


            // console.log(thisPage.data.canvasWidth);
            // console.log(thisPage.data.canvasHeight);
            // console.log(thisPage.data.maskWidth);
            // console.log(thisPage.data.maskHeight);

            myCanvas.restore();
            myCanvas.draw(!1, function() {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    destWidth: thisPage.data.canvasWidth,
                    destHeight: thisPage.data.canvasHeight,
                    canvasId: "myCanvas",
                    success: function(res) {
                        wx.previewImage({
                            urls: [ res.tempFilePath ],
                            current: res.tempFilePath
                        });

                        wx.hideLoading();
                    }
                }, thisPage);
            });
        } else wx.showToast({
            title: "请先选择一张图片",
            duration: 2e3,
            icon: "none"
        });
    },

    genDesignImg: function() {
        if ("" != this.data.photo) {
            wx.showLoading({
                title: "图片生成中"
            });
            var thisPage = this;
            var designCanvas = wx.createCanvasContext("designCanvas", this);
            var left = this.data.deltaX;
            var top = this.data.deltaY;
            var width = this.data.width / 1;
            var height = this.data.height / 1;
            var dx = left - (width * this.data.scale - width) / 2;
            var dy = top - (height * this.data.scale - height) / 2;
            thisPage._roundRect(designCanvas, 0, 0, this.data.maskWidth / 1, this.data.maskHeight / 1, width * this.data.maskRadius / this.data.width),
            designCanvas.save(),
            designCanvas.translate(left + width / 2, top + height / 2), 
            designCanvas.rotate(this.data.angle * Math.PI / 180), 
            designCanvas.translate(-(left + width / 2), -(top + height / 2)),
            designCanvas.drawImage(this.data.photo, dx, dy, width * this.data.scale, height * this.data.scale), 
            designCanvas.restore(), 
            designCanvas.drawImage(this.data.maskImg, 0, 0, thisPage.data.maskWidth / 1, thisPage.data.maskHeight / 1), 
            this.data.shapes.forEach(function(shape) {
                designCanvas.drawImage(shape.path, (thisPage.data.maskWidth / 2 + shape.x * thisPage.data.maskSizeRatio - shape.w / 2 * thisPage.data.maskSizeRatio) / 1, (thisPage.data.maskHeight / 2 + shape.y * thisPage.data.maskSizeRatio - shape.h / 2 * thisPage.data.maskSizeRatio) / 1, thisPage.data.maskSizeRatio * shape.w / 1, thisPage.data.maskSizeRatio * shape.h / 1);
            }), 
            designCanvas.draw(!1, function() {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: thisPage.data.maskWidth / 1,
                    height: thisPage.data.maskHeight / 1,
                    destWidth: thisPage.data.maskWidth / 1 * 2,
                    destHeight: thisPage.data.maskHeight / 1 * 2,
                    canvasId: "designCanvas",
                    success: function(res) {
                        wx.previewImage({
                            urls: [ res.tempFilePath ],
                            current: res.tempFilePath
                        });

                        wx.hideLoading();
                    }
                });
            });
        } else wx.showToast({
            title: "请先选择一张图片",
            duration: 2e3,
            icon: "none"
        });
    },

    _roundRect: function(canvas, left, top, width, height, radius) {
        canvas.beginPath(), 
        canvas.moveTo(left + radius, top), 
        canvas.arcTo(left + width, top, left + width, top + height, radius), 
        canvas.arcTo(left + width, top + height, left, top + height, radius), 
        canvas.arcTo(left, top + height, left, top, radius), 
        canvas.arcTo(left, top, left + width, top, radius), 
        canvas.closePath(), 
        canvas.clip();
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
            touchmoveThrottle(this, evt);
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
});

function throttle(fn, miniTimeCell) {
    var timer = null,
      previous = null;
  
    return function () {
      var now = +new Date(),
        context = this,
        args = arguments;
      if (!previous) previous = now;
      var remaining = now - previous;
      if (miniTimeCell && remaining >= miniTimeCell) {
        fn.apply(context, args);
        previous = now;
      }
    }
  }

const touchmoveThrottle = throttle(touchmove, 40);

function touchmove(page, evt) {
    let undef, data = {};

    if (evt.deltaX !== undef) {
        data.deltaX = evt.deltaX;
        data.deltaY = evt.deltaY;
    }

    if (evt.angle !== undef) {
        data.angle = evt.angle;
    }

    if (evt.scale !== undef) {
        data.scale = evt.scale;
    }

    // 一次性调用 setData
    page.setData(data);
}

