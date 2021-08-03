// pages/songDetail/songDetail.js
let appInstance = getApp()
import request from '../../utils/request'
import PubSub from 'pubsub-js';
import moment from 'moment';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    musicId:'',
    musicLink:'',
    currentTime: '00:00', // 当前时间
    durationTime: '00:00', // 总时长
    currentWidth:0,//进度条
  },
  switchMusic(event){
    let type = event.currentTarget.id;
    this.backgroundAudioManager.stop();
    PubSub.publish('switchType',type);
  },
  musicPlay() {
    let isPlay = !this.data.isPlay;
    this.setData({ isPlay });
    let {musicId,musicLink} = this.data;
    this.musicControl(isPlay,musicId,musicLink)
  },
  changeState(isPlay){
    this.setData({isPlay});
    appInstance.globalData.isMusicPlay=isPlay;
  },
  async musicControl(isPlay,musicId,musicLink){
    //创建实例
    if(isPlay){
      if(!musicLink){
        let musicLinkData=await request('/song/url',{id:musicId})
        let musicLink=musicLinkData.data[0].url;
        this.setData({musicLink});

      }
      this.backgroundAudioManager.src=this.data.musicLink;
      this.backgroundAudioManager.title=this.data.song.name;
    }else{
      console.log('stop');
      this.backgroundAudioManager.pause();
    }
  },
  async getMusicInfo(musicId){
    let songData=await request('/song/detail',{ids:musicId})
    let durationTime=moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song:songData.songs[0],
      musicId,
      durationTime,
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let musicId = options.musicId;
    this.setData({musicId})

    this.getMusicInfo(musicId);

    //通过全局的isMusicPlay属性来判断音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
			this.setData({ isPlay: true });
    }

    // onLoad中订阅一次即可
    PubSub.subscribe('musicId',async (msg,musicId)=>{
      this.getMusicInfo(musicId);
      this.musicControl(true,musicId);
    })
    
    //开启单例模式
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
		this.backgroundAudioManager.onPause(() => {
      this.changeState(false);
    });
		this.backgroundAudioManager.onStop(() => {
      this.changeState(false);
    });
		this.backgroundAudioManager.onPlay(() => {
      this.changeState(true);
      appInstance.globalData.musicId=musicId;
    });
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
      let currentWidth = (this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration)*450;
      this.setData({currentTime,currentWidth})
    });
    this.backgroundAudioManager.onEnded(()=>{
      PubSub.publish('switchtype','next');
    })
    
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