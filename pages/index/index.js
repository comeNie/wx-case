// pages/index/index.js
let globalData = getApp().globalData;
let thisApp = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var thisPage = this;
        console.log(options);

        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    toDesign: function(userRes) {
        // console.log(userRes);
        // "{"nickName":"飞","gender":1,"language":"zh_CN","city":"","province":"","country":"阿尔及利亚","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/gReakaPaF7gibh22tsQper5QD8AAky76icK0ED3PmnMPZ4BnHPqfibXHd7GmeyKPpEyRHwJZibNYE024r1gMRPlTHA/132"}"
        if (globalData.userInfo == null) {
            thisApp.callApi("https://www.91shoujike.com/api/user/update", userRes.detail.userInfo, function(res) {
                globalData.userInfo = userRes.detail.userInfo;
                wx.navigateTo({
                    url: "../../pages/selectPhone/selectPhone"
                });
            });
        } else {
            wx.navigateTo({
                url: "../../pages/selectPhone/selectPhone"
            });
        }
        
        
    },

    toCreateOrder: function () {
        wx.navigateTo({
            url: "../../pages/createOrder/createOrder"
        });
    },
    toDesign2: function () {
        wx.navigateTo({
            url: "../../pages/design3/design3"
        });
    },

})