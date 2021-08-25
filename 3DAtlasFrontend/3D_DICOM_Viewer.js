function componentToHex(c) {

    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}


function getAllImagesFromPAth(files){

    /** Method for retrieving all images contained in a folder
     * file: list containing the full path of all images**/

    _dicom = [];      // list  to save all the images

    var filePath;  //  variable to retrieve the folder in which the images are saved


    for (let i = 0; i < files.length; i++) {

        var string = files[i].name.split('.');

        _dicom.push(string[0]);

    }


    var fileRelativPath = files[0].webkitRelativePath.split('/');

        for (var x = 0; x < fileRelativPath.length - 1; x++) {
            filePath = fileRelativPath[x] + '/';
        }

    return {_dicom,filePath}
}

function GetAllImagesForTwoChannels(files) {


    /** Method for retrieving all images contained in a folder for two Channel DICOM images
     * file: list containing the full path of all images**/
    filesPaths = []  // array tho save the two Paths of the iamges (chanel 1 and 2)
    _dicom_channels_1 = []; // list to save all the images for the first channel image
    _dicom_channels_2 = [];  // list to save all the images for the two channel image
    var url_source = "";  // Path of the directory where save the two differents channels

    for (var i = 0; i < files.length; i++) {
        var string = files[i].webkitRelativePath.split('/');
        if (filesPaths.includes(string[1], 0) === false && string.length === 3) {
            filesPaths.push(string[1]);
        }
    }

    if (filesPaths.length === 0)
        alert("The directory doesn't contain two channels");
    else {
        for (var x = 0; x < files.length; x++) {
            var string = files[x].webkitRelativePath.split('/');
            if (filesPaths[0].localeCompare(string[1]) === 0 && string.length === 3)
                _dicom_channels_1.push(string[2].split('.')[0]);
            else if (filesPaths[1].localeCompare(string[1]) === 0 && string.length === 3)
                _dicom_channels_2.push(string[2].split('.')[0]);


        }


        url_source = files[2].webkitRelativePath.split('/')[0];
    }

    return {_dicom_channels_1, _dicom_channels_2, url_source, filesPaths}

}

function GenerateDAT_GUI_1_Channel(volume){

    /** Function to generate the GUI whose role is to control the variables of the volume of the object.
     * volume -> Objektvolumens**/

    // variable to  define the color of the object
    var objectColor = {
        minColor: volume.minColor,
        maxColor: volume.maxColor
    };

    var image = volume.image
    // manualMinColor + manualMaxColor = variable allowing manual input of the colours to be assigned to the image
    const manualMinColor = {
        textField: "Enter the min Color"
    }
    const manualMaxColor = {
        textField: "ENter the max Color"
    }

    //instanz of the class dat.Gui
    var gui = new dat.GUI();

    // the following configures the gui for interacting with the X.volume
    var volumegui = gui.addFolder('Volume');

    // now we can configure controllers which..
    // .. switch between slicing and volume rendering
    var vrController = volumegui.add(volume, 'volumeRendering');


    // .. configure the volume rendering opacity
    var opacityController = volumegui.add(volume, 'opacity', 0, 1).listen();

    // .. and the threshold in the min..max range
    var lowerThresholdController = volumegui.add(volume, 'lowerThreshold',
        volume.min, volume.max);
    var upperThresholdController = volumegui.add(volume, 'upperThreshold',
        volume.min, volume.max);


    //Configure the GUI to interacting with the COlor of the Volume
    var volumeColor = gui.addFolder('Color');

    var minColorController = volumeColor.addColor(objectColor, 'minColor').onChange(function () {

        var rgbArray = objectColor.minColor
        volume.minColor = [(rgbArray[0].toFixed(2) / 255.), (rgbArray[1].toFixed(2) / 255.), (rgbArray[2].toFixed(2) / 255.)];

    });

    volumeColor.add(manualMinColor, "textField").onFinishChange(function (value) {

        var minVolumeColor = value.split(',');
        if (minVolumeColor === undefined)
            alert("Ungültige Eingabe")
        else {
            volume.minColor = [(parseInt(minVolumeColor[0]).toFixed(2) / 255.), (parseInt(minVolumeColor[1]).toFixed(2) / 255.), (parseInt(minVolumeColor[2]).toFixed(2) / 255.)];
            minColorController.setValue([parseInt(minVolumeColor[0]), parseInt(minVolumeColor[1]), parseInt(minVolumeColor[2])]);

        }
    });

    var maxColorController = volumeColor.addColor(objectColor, 'maxColor').onChange(function () {

        var rgbArray = objectColor.maxColor
        volume.maxColor = [(rgbArray[0].toFixed(2) / 255.), (rgbArray[1].toFixed(2) / 255.), (rgbArray[2].toFixed(2) / 255.)];
    });

    volumeColor.add(manualMaxColor, "textField").onFinishChange(function (value) {

        var maxVolumeColor = value.split(',');
        if (maxVolumeColor === undefined)
            alert("Ungültige Eingabe")
        else {
            volume.maxColor = [(parseInt(maxVolumeColor[0]).toFixed(2) / 255.), (parseInt(maxVolumeColor[1]).toFixed(2) / 255.), (parseInt(maxVolumeColor[2]).toFixed(2) / 255.)];
            maxColorController.setValue([parseInt(maxVolumeColor[0]), parseInt(maxVolumeColor[1]), parseInt(maxVolumeColor[2])]);

        }
    });

    volumeColor.open();

    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1
    var sliceXController = volumegui.add(volume, 'indexX', 0,
        volume.dimensions[0] - 1);
    var sliceYController = volumegui.add(volume, 'indexY', 0,
        volume.dimensions[1] - 1);
    var sliceZController = volumegui.add(volume, 'indexZ', 0,
        volume.dimensions[2] - 1);

    var lowerWindowController = volumegui.add(volume, 'windowLow', volume.min,
        volume.max);
    var upperWindowController = volumegui.add(volume, 'windowHigh', volume.min,
        volume.max);

    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1

    volumegui.open();


}


function GenerateDAT_GUI_2_Channel(volume_1, volume_2){

    console.log("volume 1 dimensions = ", volume_1.dimensions)
    console.log("volume 2 dimensions = ", volume_2.dimensions)
    // variable to  define the color of the first object
    var objectColor1 = {
        minColor: volume_1.minColor,
        maxColor: volume_1.maxColor
    };

    // variable to  define the color of the second object
    var objectColor2 = {
        minColor: volume_2.minColor,
        maxColor: volume_2.maxColor
    };

    // manualMinColor + manualMaxColor = variable allowing manual input of the colours to be assigned to the image
    const object_1_manualMinColor = {
        Manual_MinColor: "Enter the min Color"
    }
    const object_1_manualMaxColor = {
        Manual_MaxColor: "ENter the max Color"
    }

    const object_2_manualMinColor = {
        Manual_MinColor: "Enter the min Color"
    }
    const object_2_manualMaxColor = {
        Manual_MaxColor: "ENter the max Color"
    }

    //instanz of the class dat.Gui for the first and second volume object

    var gui = new dat.GUI();
    var gui_1 = new dat.GUI();

    // the following configures the gui for interacting with the X.volume for the first object
    var volumegui = gui.addFolder(filesPaths[0]);
    // now we can configure controllers which..
    // .. switch between slicing and volume rendering

    var vrController = volumegui.add(volume_1, 'volumeRendering');
    // .. configure the volume rendering opacity
    var opacityController = volumegui.add(volume_1, 'opacity', 0, 1).listen();
    // .. and the threshold in the min..max range
    var lowerThresholdController = volumegui.add(volume_1, 'lowerThreshold',
        volume_1.min, volume_1.max);
    var upperThresholdController = volumegui.add(volume_1, 'upperThreshold',
        volume_1.min, volume_1.max);


    var minColorController = volumegui.addColor(objectColor1, 'minColor').onChange(function () {

        var rgbArray = objectColor1.minColor
        volume_1.minColor = [(rgbArray[0].toFixed(2) / 255.), (rgbArray[1].toFixed(2) / 255.), (rgbArray[2].toFixed(2) / 255.)];

    });

    var maxColorController = volumegui.addColor(objectColor1, 'maxColor').onChange(function () {

        var rgbArray = objectColor1.maxColor
        volume_1.maxColor = [(rgbArray[0].toFixed(2) / 255.), (rgbArray[1].toFixed(2) / 255.), (rgbArray[2].toFixed(2) / 255.)];
    });

    var manualMinColorController = volumegui.add(object_1_manualMinColor, "Manual_MinColor").onFinishChange(function (value) {

        var minVolumeColor = value.split(',');
        if (minVolumeColor === undefined)
            alert("Ungültige Eingabe")
        else {
            volume_1.minColor = [(parseInt(minVolumeColor[0]).toFixed(2) / 255.), (parseInt(minVolumeColor[1]).toFixed(2) / 255.), (parseInt(minVolumeColor[2]).toFixed(2) / 255.)];
            minColorController.setValue([parseInt(minVolumeColor[0]), parseInt(minVolumeColor[1]), parseInt(minVolumeColor[2])]);

        }
    });

    var manualMaxColorController = volumegui.add(object_1_manualMaxColor, "Manual_MaxColor").onFinishChange(function (value) {

        var maxVolumeColor = value.split(',');
        if (maxVolumeColor === undefined)
            alert("Ungültige Eingabe")
        else {
            volume_1.maxColor = [(parseInt(maxVolumeColor[0]).toFixed(2) / 255.), (parseInt(maxVolumeColor[1]).toFixed(2) / 255.), (parseInt(maxVolumeColor[2]).toFixed(2) / 255.)];
            maxColorController.setValue([parseInt(maxVolumeColor[0]), parseInt(maxVolumeColor[1]), parseInt(maxVolumeColor[2])]);

        }
    });

    var lowerWindowController = volumegui.add(volume_1, 'windowLow', volume_1.min,
        volume_1.max);
    var upperWindowController = volumegui.add(volume_1, 'windowHigh', volume_1.min,
        volume_1.max);

    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1
    var sliceXController = volumegui.add(volume_1, 'indexX', 0,
        volume_1.dimensions[0] - 1);
    var sliceYController = volumegui.add(volume_1, 'indexY', 0,
        volume_1.dimensions[1] - 1);
    var sliceZController = volumegui.add(volume_1, 'indexZ', 0,
        volume_1.dimensions[2] - 1);
    volumegui.open();


    // the following configures the gui for interacting with the X.volume
    var volumegui_1 = gui_1.addFolder(filesPaths[1]);
    // now we can configure controllers which..
    // .. switch between slicing and volume rendering
    var vrController_1 = volumegui_1.add(volume_2, 'volumeRendering');
    // .. configure the volume rendering opacity
    var opacityController_1 = volumegui_1.add(volume_2, 'opacity', 0, 1).listen();
    // .. and the threshold in the min..max range
    var lowerThresholdController_1 = volumegui_1.add(volume_2, 'lowerThreshold',
        volume_2.min, volume_2.max);
    var upperThresholdController_1 = volumegui_1.add(volume_2, 'upperThreshold',
        volume_2.min, volume_2.max);


    var minColorController_1 = volumegui_1.addColor(objectColor2, 'minColor').onChange(function () {

        var rgbArray = objectColor2.minColor
        volume_2.minColor = [(rgbArray[0].toFixed(2) / 255.), (rgbArray[1].toFixed(2) / 255.), (rgbArray[2].toFixed(2) / 255.)];

    });

    var maxColorController_1 = volumegui_1.addColor(objectColor2, 'maxColor').onChange(function () {

        var rgbArray = objectColor2.maxColor
        volume_2.maxColor = [(rgbArray[0].toFixed(2) / 255.), (rgbArray[1].toFixed(2) / 255.), (rgbArray[2].toFixed(2) / 255.)];
    });


    var manualMinColorController_1 = volumegui_1.add(object_2_manualMinColor, "Manual_MinColor").onFinishChange(function (value) {

        var minVolumeColor_1 = value.split(',');
        if (minVolumeColor_1 === undefined)
            alert("Ungültige Eingabe")
        else {
            volume_2.minColor = [(parseInt(minVolumeColor_1[0]).toFixed(2) / 255.), (parseInt(minVolumeColor_1[1]).toFixed(2) / 255.), (parseInt(minVolumeColor_1[2]).toFixed(2) / 255.)];
            minColorController_1.setValue([parseInt(minVolumeColor_1[0]), parseInt(minVolumeColor_1[1]), parseInt(minVolumeColor_1[2])]);

        }
    });

    var manualMaxColorController_1 = volumegui_1.add(object_2_manualMaxColor, "Manual_MaxColor").onFinishChange(function (value) {

        var maxVolumeColor = value.split(',');
        if (maxVolumeColor === undefined)
            alert("Ungültige Eingabe")
        else {
            volume_2.maxColor = [(parseInt(maxVolumeColor[0]).toFixed(2) / 255.), (parseInt(maxVolumeColor[1]).toFixed(2) / 255.), (parseInt(maxVolumeColor[2]).toFixed(2) / 255.)];
            maxColorController_1.setValue([parseInt(maxVolumeColor[0]), parseInt(maxVolumeColor[1]), parseInt(maxVolumeColor[2])]);

        }
    });


    var lowerWindowController_1 = volumegui_1.add(volume_2, 'windowLow', volume_2.min,
        volume_2.max);
    var upperWindowController_1 = volumegui_1.add(volume_2, 'windowHigh', volume_2.min,
        volume_2.max);
    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1
    var sliceXController_1 = volumegui_1.add(volume_2, 'indexX', 0,
        volume_2.dimensions[0] - 1);
    var sliceYController_1 = volumegui_1.add(volume_2, 'indexY', 0,
        volume_2.dimensions[1] - 1);
    var sliceZController_1 = volumegui_1.add(volume_2, 'indexZ', 0,
        volume_2.dimensions[2] - 1);
    volumegui_1.open();

}

function generate3DViewer(mode, filePaths, container) {
    /** Method to generate a §D DICOM Visualisation
     * mode: determines the type of mode to be used: 1-> corresponds to a one-channel image and 2-> to a two-channel image.
     * filePaaths: Directory  to the Dicom image folder
     * container: frame of the HTML where the viewer will be stacked**/


    // create   a 3D renderer
    var r = new X.renderer3D();



    //assign the frame to the viewer before it is initialized
    r.container = container;



    //initialize the 3D renderer
    r.init();


    //define the camera position
    r.camera.position = [0, 300, 0];


    if (mode === 1) {
        var v = new X.volume();

        let{_dicom, filePath} = getAllImagesFromPAth(filePaths);
        // map the data url to each of the slices
           v.file = _dicom.sort().map(function (v) {


                return filePath + '/' + v + '.dcm';

            });





        // add the volume
        r.add(v);

        var mouse_x, mouse_y;
        r.interactor.onMouseMove = function(event) {
            mouse_x = event.offsetX;
            mouse_y = event.offsetY;
        }

        r.interactor.onMouseDown = function(left,middle, right) {
            if (right) {
                console.log(mouse_x,mouse_y)
                var currentMousePosition = interactor.mousePosition
                console.log("mouse current position = " , currentMousePosition)
                var picked_id = r.pick(mouse_x, mouse_y);
                if (picked_id==-1) throw new Error("No object");
                var picked_object = r.get(picked_id);
                console.log(picked_object)
                var _dimensions = v.dimensions;
                console.log(_dimensions)
                console.log(v.image)
                var windowsSize = document.getElementById(container).getBoundingClientRect()

                var object_coordinate = [windowsSize]
                var mycontainer = r.container;


                // use settimeout or something else to destroy the caption
            }
        }
        var interactor = r.interactor;

        interactor.init()

        r.onShowtime = function () {

            GenerateDAT_GUI_1_Channel(v);


        };


        // adjust the camera position a little bit, just for visualization purposes
        r.camera.position = [120, 80, 160];

        // this triggers the loading of the volume and executes
        // r.onShowtime() once done
        r.render();



        interactor.onMouseWheel = function(event)
        {
            //console.log(event)
            var currentMousePosition = interactor.mousePosition
           // console.log(canvas)
            var _dimensions = v.dimensions;
            //console.log(_dimensions)
            //console.log(document.getElementById(container).getBoundingClientRect())



            //console.log(currentMousePosition)
        }





    }


    else {


        var v1 = new X.volume();
        var v2 = new X.volume();


        let{_dicom_channels_1, _dicom_channels_2,url_source,filesPaths} = GetAllImagesForTwoChannels(filePaths);
        v1.file = _dicom_channels_1.sort().map(function (v1) {

            // we also add the 'fake' .DCM extension since else wise
            // XTK would think .org is the extension
            return url_source + '/' + filesPaths[0] + '/' + v1 + '.dcm';

        });


        v2.file = _dicom_channels_2.sort().map(function (v2) {

            // we also add the 'fake' .DCM extension since else wise
            // XTK would think .org is the extension
            return url_source + '/' + filesPaths[1] + '/' + v2 + '.dcm';

        });
        // add the volume
        r.add(v1);
        r.add(v2);


        r.camera.position = [0, 400, 0];

        r.onRender = function () {


        };

        r.onShowtime = function () {

            GenerateDAT_GUI_2_Channel(v1,v2);

        }
        // adjust the camera position a little bit, just for visualization purposes
        r.camera.position = [80, 80, 80];

        // showtime! this triggers the loading of the volume and executes
        // r.onShowtime() once done
        r.render();

    }
}

function getTheImageData(volume)
{
    var image =  volume.image

    console.log(image[0])


}

