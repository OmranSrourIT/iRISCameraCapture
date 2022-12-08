import { Component, createElement } from "react";
import "./ui/IRISCameraCapture.css";
import axios from 'axios';

export class IRISCameraCapture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WindowsApiUrlGetImage: "http://localhost:1234/api/Home/GetAllImage_Live",
            WindowsApiUrlOpenDevice_Camera: "http://localhost:1234/api/Home/OpenDeviceIRIS_CAMERA",
            URLTakeLiveImage_Capture: "http://localhost:1234/api/Home/TakeLiveImage_Capture",
            URLStopLiveImage_Capture : "http://localhost:1234/api/Home/StopLiveImage_Capture",
            FlagWhenCloseDevice: false,
            ProgressloadingHidden: false,
            IMAGE_IRIS: `./img/${this.props.ModuleName.value}$${this.props.ImageCollection.value}$SerivceNotFound.png`,
            imgCaptured: `./img/${this.props.ModuleName.value}$${this.props.ImageCollection.value}$PersonPic.png`,
            
            FakeIMageHide: false,
            ChnageStyle: { borderRadius: '1px solid #000000' , objectFit: 'contain' },
            ChnageIMage2Style : {borderRadius: '1px solid #000000' , objectFit: 'contain' }

        }

        // this.onClickHandler = this.onClick.bind(this);
    }

    RefreshCamera()
    {
        // if (!this.state.IMAGE_IRIS.includes("data:image/png;base64")) {
            window.location.reload();
        // }else{
        //     alert("الكاميرا قيد التشغيل")
        // }
    }

    ClosePage()
    {

        if (this.props.onCloseAction && this.props.onCloseAction.canExecute) {
          
                this.props.onCloseAction.execute();
            }
    }

    componentWillUnmount()
    { 
        this.CloseDevice();

    }

    CloseDevice()
    {
        axios.get(this.state.URLStopLiveImage_Capture)
        .then((response) => { 
            console.log(response.data);
        }, (error) => {
            console.log(error);
        });

    }

    SaveCaptureCamera() {
        debugger;
        if (this.props.onSaveAction && this.props.onSaveAction.canExecute) {
            if (this.state.imgCaptured.includes("data:image/png;base64")) {
                this.props.onSaveAction.execute();
            }else
            {
                alert("يرجى التقاط الصوره اولا")
            }

        }
    }


    ButtonCaptureImage() {
        debugger;
        if (this.state.IMAGE_IRIS.includes("data:image/png;base64")) {
            axios.get(this.state.URLTakeLiveImage_Capture)
                .then((response) => {

                    var SplitstrImage = this.state.IMAGE_IRIS.split(',')[1];
                    this.setState({
                        ChnageIMage2Style :  {borderRadius: '1px solid #000000'},
                        imgCaptured: "data:image/png;base64," + SplitstrImage
                    }, () => {
                        this.props.ImageCamera.setValue(SplitstrImage);
                    })

                    console.log(response.data);
                }, (error) => {
                    console.log(error);
                });


        } else {
            alert("يرجى تشغيل الكاميرا لاخد الصورة")
        }


    }

    OpenDeviceIRISCameraCaptrue() {
        axios.get(this.state.WindowsApiUrlOpenDevice_Camera)
            .then((response) => {

                debugger;

                this.setState({
                    ProgressloadingHidden: true
                }, () => {
                    if (response.data[0] == 'ConnectionSuccssfult') {
                        // $('#fakeIMage').show();
                        // $('#pageloaddivLeft').hide();
                        // alert("تم تشغيل الكاميرا بنجاح");
                    } else if (response.data[0] == 'IS_ERROR_ALREADY_OPEN') {
                        // $('#fakeIMage').show();
                        // $('#pageloaddivLeft').hide();
                        // alert("الكاميرا حاليا في وضع التشغيل");
                    } else if (response.data[0] == 'IS_ERROR_NONE') {
                        this.setState({
                            FlagWhenCloseDevice: false
                        }, () => {
                            // alert('حصل خطا في الجهاز')
                        })
                    } else {
                        this.setState({
                            FlagWhenCloseDevice: true
                        }, () => {

                            // alert('يرجى التاكد من توصيل الجهاز');
                            this.setState({
                                FakeIMageHide: false,
                                ChnageStyle: { borderRadius: '1px solid #000000', objectFit: 'contain' },
                                IMAGE_IRIS:  `./img/${this.props.ModuleName.value}$${this.props.ImageCollection.value}$DeviceNotConnetced.png`,

                            })

                        })

                    }

                })

                console.log(response.data);
            }, (error) => {
                if (confirm("قد يكون الجهاز غير متوفر او الخدمة متوقفة أو أنه لم يتم تثبيتها . هل تود تحميل تعريف الإصدار الأحدث من الخدمة؟")) {
                    window.open("./WindowsServices/IRISCameraWinSetup.msi", "_base");
                }
            });
    }
  
    componentDidMount() {

        this.OpenDeviceIRISCameraCaptrue();
        setTimeout(() => {
            debugger;
             if (!this.state.FlagWhenCloseDevice) {
                debugger;
                setInterval(() => {
                    axios.get(this.state.WindowsApiUrlGetImage)
                        .then((response) => {
                            debugger;
                            if (response.data == 0) {

                                this.setState({
                                    ProgressloadingHidden: false,
                                    FakeIMageHide: false,
                                    IMAGE_IRIS: `./img/${this.props.ModuleName.value}$${this.props.ImageCollection.value}$RefreshPage.jpg`,
                                    ChnageStyle: { borderRadius: '1px solid #000000', objectFit: 'contain' },
                                })


                            } else {
                                this.setState({
                                    ChnageStyle: { borderRadius: '1px solid #000000' },
                                    FakeIMageHide: true,
                                    ProgressloadingHidden: false,
                                    IMAGE_IRIS: "data:image/png;base64," + response.data.IMAGE_Arr
                                })

                            }

                        }, (error) => {

                            console.log(error);
                        });
                });

             }

        }, 500);


    }

    render() {
        return (
            <div class="container">

                <div className="row RowHeader header">
                    {/* <div className="col-xs-6 col-sm-6 col-md-6">
                        <img src={`./img/${this.props.ModuleName.value}$${this.props.ImageCollection.value}$IraqLogo.png`} />
                       
                        
                    </div> */}

                    <div className="col-xs-6 col-sm-6 col-md-6">

                        <h2 style={{
                            color: "white",
                            position: "relative",
                            top: "35%",
                        }} >التقاط الصورة الشخصيه</h2>
                    </div>
                    
                </div>

                <div className="row HeaderRow2">
                        <div class="col-xs-6 col-sm-6 col-md-6">
                            <button id="buttonRefresh" onClick={()=>this.RefreshCamera()} class="btn btn-success btn-block"><p>تحديث</p></button>
                            <button id="buttonRefresh" onClick={()=>this.ClosePage()} class="btn btn-success btn-block"><p>الغاء</p></button>
                            {/* <button id="buttonRefresh" onClick={()=>this.CloseDevice()} class="btn btn-success btn-block"><p>اغلاق الجهاز</p></button> */}
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-6"> 
                        </div>

                    </div>

                <div className="row ContainerImages">
                    <div className="col-xs-1 col-sm-1 col-md-1">

                    </div>
                    <div className="col-xs-5 col-sm-5 col-md-5" style={{ display: 'grid', justifyItems: 'center' }}>
                        <div class="img_camera">
                            {this.state.ProgressloadingHidden ? (
                                <div id="Progressloading">
                                </div>
                            ) : ('')}

                            {this.state.FakeIMageHide ? (<img id="fakeIMage" src={ `./img/${this.props.ModuleName.value}$${this.props.ImageCollection.value}$outline.png`}/>) : ('')}

                           



                        </div>

                        <img src={this.state.IMAGE_IRIS} class="borderSstyle" width="240" height="320" style={this.state.ChnageStyle} />
                        <button type="button" id="captureButton" onClick={() => this.ButtonCaptureImage()} class="btn btn-primary" style={{visibility : this.props.EnableButtonCapture.value == 'false' ? "hidden" : "visible", width: '90%' }}><p>التقاط الصورة</p></button>

                    </div>
                    <div className="col-xs-5 col-sm-5 col-md-5" style={{ textAlign: '-webkit-center' }}>
                        <img src={this.state.imgCaptured} class="borderSstyle" width="240" height="320" style={this.state.ChnageIMage2Style} />
                        <button type="button" id="SaveImageCapture" onClick={() => this.SaveCaptureCamera()} class="btn btn-success btn-block" style={{visibility : this.props.EnableButtonSave.value == 'false' ? "hidden" : "visible" , width: '90%' }}><p>حفظ الصورة</p></button>
                    </div>

                </div>
            </div>

        );
    }


}
