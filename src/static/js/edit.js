(function() {
  // 本地hotspot编号自增索引
  let index = 0;
  // 全景图播放工具对象
  let krpano = null;
  // 全景图数据对象
  let panorama = null;
  // 全景图ID
  let id = document.getElementById('panoramaId').value;


  /**
   * 事件注册工具
   */
  const EventTool = (function () {
    function init() {
      const addHotspotBtn = document.getElementById('addHotspot');
      const previewBtn = document.getElementById('preview');

      addHotspotBtn.addEventListener('click', showDialog);
      previewBtn.addEventListener('click', preview);
    }

    function showDialog() {
      const select = document.createElement('select');
      select.id = 'hotspotType';
      [
        {value: '', text: '请选择热点类型：'},
        {value: 'text', text: '文本'},
        // {value: 'link', text: '链接'},
        {value: 'tour', text: '切换'},
        // {value: 'focus', text: '聚焦'},
        {value: 'video', text: '视频'}
      ].forEach((item) => {
        let option = document.createElement('option');
        option.value = item.value;
        option.innerText = item.text;
        select.appendChild(option);
      });
      select.onchange = changeHotType;

      Dialog.show({
        title: '添加热点',
        content: select,
        onConfirm: onConfirm
      });
    }

    function preview() {
      window.open(`/page/panoramas/${id}`);
    }

    function changeHotType(e) {
      const typeContent = document.getElementById('typeContent');
      typeContent && (typeContent.remove());

      const type = e.target.value;
      if (type) {
        const method = `get${Utils.capitalize(type)}Content`;
        if (SelectorTool[method]) {
          const content = SelectorTool[method]();
          content.id = 'typeContent';
          const dialogContent = document.querySelector('.dialog-content');
          dialogContent.appendChild(content);
        }
      }
    }

    function onConfirm() {
      const hotspotType = document.getElementById('hotspotType');
      const fields = document.querySelectorAll('#typeContent .field');
      const type = hotspotType && hotspotType.value;
      const extra = {};

      if (!type) {
        return;
      }

      switch (type) {
        case 'text':
          let text = fields[0].value;
          if (!text) {
            Toast.show('请输入文本');
            return;
          }
          extra.text = text.replace(/\n/g, '[br]');
          break;
        case 'tour':
          let scene = document.querySelector('#typeContent .field:checked').value;
          if (!scene) {
            Toast.show('请选择下一个场景');
            return;
          }
          extra.scene = scene;
          break;
        case 'video':
          let video = fields[0].value;
          if (!video) {
            Toast.show('请输入视频地址');
            return;
          }
          extra.video = video.split('\n').join('|');
          break;
      }

      HotspotTool.add({
        type,
        extra
      });
    }

    return {
      init
    };
  })();



  /**
   * 热点类型选择器工具
   */
  const SelectorTool = (function () {
    function getTextContent() {
      const content = document.createElement('div');
      content.className = 'type-content';

      const textarea = document.createElement('textarea');
      textarea.rows = 3;
      textarea.name = 'text';
      textarea.className = 'field';
      textarea.placeholder = '请输入文本，需换行时请按回车键';
      content.appendChild(textarea);

      return content;
    }

    function getTourContent() {
      const content = document.createElement('div');
      content.className = 'type-content tour-content';

      const label = document.createElement('label');
      label.innerHTML = '请选择下一个场景';

      const currentSceneName = SceneTool.getCurrent(true);
      const wrapper = document.createElement('div');
      const scenes = panorama.scenes || [];
      if (scenes.length) {
        for (let i = 0; i < scenes.length; i++) {
          let scene = scenes[i];
          if (scene.name === currentSceneName) {
            continue;
          }

          let label = document.createElement('label');
          let input = document.createElement('input');
          input.type = 'radio';
          input.name = 'scene';
          input.value = scene.name;
          input.className = 'field';
          label.appendChild(input);
          let img = document.createElement('img');
          img.src = scene.thumb;
          label.appendChild(img);
          wrapper.appendChild(label);
        }
      }

      content.appendChild(label);
      content.appendChild(wrapper);

      return content;
    }

    function getLinkContent() {
      const content = document.createElement('div');
      content.className = 'type-content';

      const linkInput = document.createElement('input');
      linkInput.name = 'text';
      linkInput.className = 'field';
      linkInput.placeholder = '请输入链接文本';
      content.appendChild(linkInput);

      const textInput = document.createElement('input');
      textInput.name = 'url';
      textInput.className = 'field';
      textInput.placeholder = '请输入链接地址';
      content.appendChild(textInput);

      return content;
    }

    function getFocusContent() {

    }

    function getVideoContent() {
      const content = document.createElement('div');
      content.className = 'type-content';

      const textarea = document.createElement('textarea');
      textarea.name = 'video';
      textarea.className = 'field';
      textarea.rows = 3;
      textarea.placeholder = '请输入视频地址，可用换行分割多个地址，播放器将依次检测支持的视频格式播放';
      content.appendChild(textarea);

      return content;
    }

    return {
      getTextContent,
      getTourContent,
      getLinkContent,
      getFocusContent,
      getVideoContent
    };
  })();



  /**
   * 全景图渲染工具
   */
  const PanoTool = (function () {
    function init() {
      return new Promise(function (resolve, reject) {
        embedpano({
          swf: '/krpano/tour.swf',
          target: 'pano',
          xml: null,
          html5: 'auto',
          mobilescale: 1.0,
          passQueryParameters: false,
          consolelog: true,
          debugmode: true,
          onready: function (krpanoObj) {
            krpano = krpanoObj;
            resolve();
          },
          onerror: function () {
            reject();
          }
        });
      });
    }

    window.onToggleScene = function() {
      SceneTool.editable();
    };

    function injectXML() {
      return `
        <action name="draghotspot">
          spheretoscreen(ath, atv, hotspotcenterx, hotspotcentery, calc(mouse.stagex LT stagewidth/2 ? 'l' : 'r'));
          sub(drag_adjustx, mouse.stagex, hotspotcenterx);
          sub(drag_adjusty, mouse.stagey, hotspotcentery);
          asyncloop(pressed,
            sub(dx, mouse.stagex, drag_adjustx);
            sub(dy, mouse.stagey, drag_adjusty);
            screentosphere(dx, dy, ath, atv);
          );
        </action>
        <action name="togglescene">
          js(window.onToggleScene());
        </action>
        <events onnewscene="togglescene();" />`.trim();
    }

    function render() {
      const injectedXML = injectXML();
      let xmlString = KrpanoTool.getXML(panorama, injectedXML, true);
      krpano.call('loadxml(' + escape(xmlString) + ', null, MERGE, BLEND(0.5));');
    }

    return {
      init,
      render
    };
  })();



  /**
   * 全景操作工具
   */
  const PanoramaTool = (function () {
    function init() {
      return Http.query(`/api/panoramas/${id}`).then(function (data) {
        panorama = data;
        panorama.scenes = panorama.scenes || [];
      });
    }

    return {
      init
    };
  })();



  /**
   * 场景操作工具
   */
  const SceneTool = (function () {
    function getCurrent(isJustName) {
      const sceneName = krpano.get('xml.scene');

      if (isJustName) {
        return sceneName;
      }

      const scenes = panorama.scenes;
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        if (scene.name === sceneName) {
          return scene;
        }
      }
    }

    function editable() {
      const scene = getCurrent();
      scene.hotspots.forEach(function (hotspot) {
        HotspotTool.editable(hotspot);
      });
    }

    return {
      getCurrent,
      editable
    };
  })();



  /**
   * 热点操作工具
   */
  const HotspotTool = (function () {
    let currentHotspot = null;
    const hotspotActions = document.getElementById('hotspotActions');
    const saveHotspot = document.getElementById('saveHotspot');
    const deleteHotspot = document.getElementById('deleteHotspot');

    function init() {
      hotspotActions.addEventListener('mouseleave', hideEditor);
      saveHotspot.addEventListener('click', save);
      deleteHotspot.addEventListener('click', del);
    }

    function showEditor(hotspot, position) {
      hotspotActions.style.display = 'block';
      hotspotActions.style.left = parseInt(position.x) + 'px';
      hotspotActions.style.top = parseInt(position.y - 60) + 'px';
      hotspotActions.hotspot = hotspot;
    }

    function hideEditor() {
      hotspotActions.style.display = 'none';
    }

    function add(hotspot) {
      let icon = '';
      switch (hotspot.type) {
        case 'text':
          icon = '/img/text.png';
          break;
        case 'link':
          icon = '/img/link.png';
          break;
        case 'tour':
          icon = '/img/tour.png';
          break;
        case 'focus':
          icon = '/img/focus.png';
          break;
        case 'video':
          icon = '/img/video.png';
          break;
      }

      const name = hotspot.name || 'hotspot_' + index++;
      hotspot.name = name;
      hotspot.ath = hotspot.ath || 0;
      hotspot.atv = hotspot.atv || 0;
      hotspot.url = hotspot.url || icon;

      krpano.call(`addhotspot(${name});`);
      for (let key in hotspot) {
        if (hotspot.hasOwnProperty(key) && key !== 'extra') {
          krpano.set(`hotspot[${name}].${key}`, hotspot[key]);
        }
      }
      editable(hotspot);
    }

    function editable(hotspot) {
      const name = hotspot.name;
      krpano.set(`hotspot[${name}].ondown`, 'draghotspot();');
      krpano.set(`hotspot[${name}].onover`, function () {
        const ath = krpano.get(`hotspot[${name}].ath`);
        const atv = krpano.get(`hotspot[${name}].atv`);
        const position = krpano.spheretoscreen(ath, atv);
        showEditor(hotspot, position);
      });
    }

    function save() {
      const scene = SceneTool.getCurrent();
      const hotspot = hotspotActions.hotspot;
      const id = hotspot.id;
      const name = hotspot.name;
      const type = hotspot.type;
      const url = hotspot.url;
      const scene_id = scene.id;
      const extra = hotspot.extra;
      const ath = krpano.get(`hotspot[${name}].ath`);
      const atv = krpano.get(`hotspot[${name}].atv`);
      if (hotspot.id) {
        Http.update(`/api/hotspots`, {id, ath, atv})
          .then(function () {
            Toast.show('热点更新成功');
          });
      } else {
        Http.create(`/api/hotspots`, {type, name, url, scene_id, extra, ath, atv})
          .then(function (data) {
            hotspot.id = data.id;
            Toast.show('热点创建成功');
          });
      }
    }

    function del(id) {
      Http.del(`/api/hotspots/${id}`)
        .then(function (data) {

        });
    }

    return {
      init,
      add,
      editable,
      showEditor,
      hideEditor
    }
  })();



  PanoTool.init()
    .then(function () {
      PanoramaTool.init()
        .then(function () {
          EventTool.init();
          HotspotTool.init();
          PanoTool.render();
        });
    });
})();