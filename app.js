//app.js
App({
    onLaunch: function (options) {
        console.log(options);
        this.globalData.systemInfo = wx.getSystemInfoSync();
        console.log(this.globalData.systemInfo);
        this.globalData.rpxRatio = this.globalData.systemInfo.windowWidth / 750;

        this.doLogin();
    },

    globalData: {
        userInfo: null,
        systemInfo: null,
        rpxRatio: 1,
        token: null,
    },

    doLogin: function (successCallback = function(){}) {
        var thisPage = this;

        if (thisPage.globalData.token != null) {
            return;
        }

        wx.login({
            success: function (loginRes) {
                // console.log(loginRes);
                if (loginRes.code) {
                    wx.request({
                        url: "https://www.91shoujike.com/api/login?code=" + loginRes.code,
                        method: "POST",
                        data: {},
                        success: function (res) {
                            console.log(res);
                            if (res.statusCode == 200) {
                                if (res.data.code == 200) {
                                    thisPage.globalData.token = res.data.data.token;
                                    successCallback();
                                    console.log("登录成功！");
                                } else {
                                    console.log("登录失败！" + res.data.msg);
                                }
                            } else {
                                thisPage._showMaintainTip();
                            }
                        },
                        fail: function () {
                            thisPage._showMaintainTip();
                        }
                    });
                } else {
                    console.log("登录失败！" + loginRes.errMsg);
                }
            }
        });
    },

    callApi: function (apiUrl, requestData, successCallback = function(){}) {
        var thisPage = this;
        if (thisPage.globalData.token == null) {
            thisPage.doLogin(function () {
                thisPage.callApi(apiUrl, requestData, successCallback);
            });
            return;
        }

        wx.request({
            url: apiUrl + "?token=" + thisPage.globalData.token,
            method: "POST",
            data: requestData,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                    if (res.data.code == -2) {
                        console.log(res.data.msg);
                        thisPage.globalData.token = null;
                        thisPage.doLogin(function () {
                            thisPage.callApi(apiUrl, requestData, successCallback);
                        });
                        return;
                    } else if (res.data.code == 200) {
                        successCallback(res.data);
                        console.log("请求成功！" + apiUrl);
                    } else {
                        console.log(res.data.msg);
                    }
                } else {
                    console.log("服务器异常！" + apiUrl);
                }
            },
            fail: function () {
                console.log("Call api error: " + apiUrl);
            }
        });
    },

    doUploadFile: function(apiUrl, fileFieldName, filePath, postData = {}, successCallback = function(){}) {
        var thisPage = this;
        wx.uploadFile({
            url: apiUrl + "?token=" + thisPage.globalData.token,
            name: fileFieldName,
            filePath: filePath,
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: postData,
            success: function(res) {
                console.log(res);
                successCallback(JSON.parse(res.data));
            },
            fail: function(res) {
                wx.showToast({
                    title: "上传图片失败，请稍后再试",
                    icon: "none"
                });
            }
        });
    },
    
    _showMaintainTip: function () {
        wx.showModal({
            title: "提示",
            content: "服务器正在维护中。预计恢复时间2小时",
            success: function(res) {
                res.confirm ? console.log("用户点击确定") : res.cancel && console.log("用户点击取消");
            }
        });
    },

})