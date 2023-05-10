(function(thisObj) {
    var scriptName = "图层排序工具";
    
    // 创建UI面板，并设置居中对齐
    var uiPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, { resizeable: false });
    uiPanel.alignChildren = "center";

    // 添加静态文本
    var creditText = uiPanel.add("statictext", undefined, "张珑耀制作");

    // 添加输入框和标签
    var frameInputGrp = uiPanel.add("group");
    frameInputGrp.add("statictext", undefined, "隔级帧数：");
    var frameInput = frameInputGrp.add("edittext", undefined, "1");
    frameInput.characters = 3;
    
    // 添加排序类型下拉菜单和标签
    var sortTypeGrp = uiPanel.add("group");
    sortTypeGrp.add("statictext", undefined, "排序方式：");
    var sortTypeDropdown = sortTypeGrp.add("dropdownlist", undefined, ["交错排列", "顺序排列", "随机排列"]);
    sortTypeDropdown.selection = 0;

    // 添加运行按钮
    var runBtn = uiPanel.add("button", undefined, "运行");
    uiPanel.runBtn = runBtn;
    
    uiPanel.layout.layout(true);  // 添加此行以实现布局

    // 给按钮添加点击事件 
    uiPanel.runBtn.onClick = function() {
        app.beginUndoGroup(scriptName); 
        sortLayers(uiPanel); 
        app.endUndoGroup(); 
    };

    function sortLayers(uiPanel) { 
        var comp = app.project.activeItem; 
        var selLayers = comp.selectedLayers; 
        var numLayers = selLayers.length; 
        var time = 0;
        var interleaveFrames = parseInt(uiPanel.frameInput.text);
        var sortType = uiPanel.sortTypeDropdown.selection.index;

        switch (sortType) {
            case 0:
                for (var i = 0; i < numLayers; i++) {
                    selLayers[i].startTime = time;
                    time += interleaveFrames * comp.frameDuration;
                }
                break;
            case 1:
                for (var i = numLayers -1; i >=0; i--) {
                    selLayers[i].startTime = time;
                    time += interleaveFrames * comp.frameDuration;
                }
                break;
            case 2:
                var shuffledLayers = shuffle(selLayers);
                for (var i = 0; i < numLayers; i++) {
                    shuffledLayers[i].startTime = time;
                    time += interleaveFrames * comp.frameDuration;
                }
                break;
            default:
                alert("请选择有效的排序方式！");
                return;
        }
    }

    function shuffle(array) { 
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
    
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
    } 
})(this);
