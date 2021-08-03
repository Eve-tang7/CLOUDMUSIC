import request from '../../utils/request';

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'13402660030',
    password:'tyt67683320',
  },
  handleInput(event){
    let type = event.currentTarget.dataset.type
    this.setData({
      [type]:event.detail.value
    })
    console.log(this.data);
  },
  async login(){
    let {phone,password} = this.data;
    let phoneReg=/^1(2|3|4|5|6|7|8|9)\d{9}/;
    if(!phone){
      wx.showToast({
        title: 'please enter your phone',
        icon:'none'
      })
      return
    }
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: 'wrong phone number',
        icon:'none'
      })
      return
    }
    if(!password){
      wx.showToast({
        title: 'please enter your password',
        icon:'none'
      })
      return
    }
    //后端验证
    let result = await request('/login/cellphone',{phone,password,isLogin:true})
    if(result.code === 200){
      wx.setStorageSync('userInfo', result.profile)
      wx.switchTab({
        url: '/pages/personal/personal',
      })
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号错误',
      })
    }else if(result.code ===502){
      wx.showToast({
        title: '密码错误',
      })
    }else{
      wx.showToast({
        title: '登陆失败',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('userInfo')){
      wx.switchTab({
        url: '/pages/personal/personal',
      })
    }
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

  }
})