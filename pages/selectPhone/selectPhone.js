// pages/selectPhone/selectPhone.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        brand_id: 0,
        brandsList: [],
        seriesPhoneList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var thisPage = this;
        wx.showLoading({
            title: "加载中"
        });
        wx.request({
            url: "https://www.91shoujike.com/brands.json",
            data: {
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    thisPage.setData({
                        brandsList: res.data.data,
                    });
                    thisPage._getSeriesPhoneList(res.data.data[0].brand_id);
                }
                wx.hideLoading();
            }
        });
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

    doSelectBrand: function (evt) {
        var thisPage = this;
        // console.log(evt);

        thisPage._getSeriesPhoneList(evt.currentTarget.dataset.brand_id);
    },
    _getSeriesPhoneList: function (brandId) {
        var thisPage = this;

        wx.request({
            url: "https://www.91shoujike.com/seriesPhones.json",
            data: {
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    thisPage.setData({
                        brand_id: brandId,
                        seriesPhoneList: res.data.data,
                    });
                }
            }
        });
    },
    doSelectPhone: function (evt) {
        // console.log(evt.currentTarget.dataset);
        wx.redirectTo({
            url: "../../pages/design/design?phoneId=" + evt.currentTarget.dataset.phone_id + "&phoneName=" + evt.currentTarget.dataset.phone_name,
        });
    }
})