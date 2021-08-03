// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//导航标签数据
    navId:'',
    videoList:[],
    videoId:'',//公共的videoId
    videoUpdateTime:[],
    trigger:false,
  },
  changeNav(e){
    console.log(e.currentTarget.dataset.id);
    this.setData({
      videoList:[],
      navId:+e.currentTarget.dataset.id,
    })
    wx.showLoading({
      title: 'loading',
    })
    this.getVidoeList(this.data.navId)
  },
  handlePlay(e){
    this.vid !== e.currentTarget.id&&this.videoContent&&this.videoContent.stop()
    this.vid = e.currentTarget.id;
    
    this.setData({
      videoId:this.vid,
    })
    this.videoContent=wx.createVideoContext(this.vid);
    this.videoContent.play();
  },
  handleTimeUpdate(event){
    let {videoId,videoUpdateTime} = this.data;
    let currentVideoObj = {vid:videoId,currentTime:event.detail.currentTime};
    // 查找对象是否已经存在
    let videoTimeObj = videoUpdateTime.find((item)=>{
      item.vid === videoId
    })
    if(videoTimeObj){
      videoTimeObj.currentTime = event.detail.currentTime;
    }else{
      videoUpdateTime.push(currentVideoObj);
    }
    this.setData({
      videoUpdateTime,
    })
  },
  //下拉刷新
  handleRefresher(){
    this.getVidoeList(this.data.navId)
  },
  onShareAppMessage: function (res) {
    if (res.from === 'menu') {
      return {
          title: '我是右上角的转发',
          path: '/pages/video/video',
          imageUrl: '/static/images/nvsheng.jpg',
      };
    } else {
      return {
          title: '我是按钮的转发',
          path: '/pages/video/video',
          imageUrl: '/static/images/nvsheng.jpg',
      };
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //判断用户是否登陆
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    }


    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupListData.data.splice(0,14),
      navId:videoGroupListData.data[0].id
    });
    this.getVidoeList(this.data.navId)
  },

  async getVidoeList(navId){
    let videoListData=await request('/video/group/',{id:navId});
    let index = 0;
    let videoList = videoListData.datas.map((item)=>{
      item.id = index++;
      return item;
    })
    this.setData({
      videoList,
      trigger:false,
    })
    wx.hideLoading();
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