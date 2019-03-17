var KrpanoTool = (function KrpanoTool() {
  var index = 0;

  function getXML(data, injectedXML, isEdit) {
    return `<krpano version="1.19" title="" debugmode="true">
              <include url="/krpano/skin/skin.xml" />
              <include url="/krpano/video-player.xml" />
              <skin_settings maps="false"
                maps_type="google"
                maps_bing_api_key=""
                maps_google_api_key=""
                maps_zoombuttons="false"
                gyro="true"
                webvr="true"
                webvr_gyro_keeplookingdirection="false"
                webvr_prev_next_hotspots="true"
                littleplanetintro="true"
                title="true"
                thumbs="true"
                thumbs_width="100" thumbs_height="70" thumbs_padding="10" thumbs_crop="0|40|240|160"
                thumbs_opened="false"
                thumbs_text="false"
                thumbs_dragging="true"
                thumbs_onhoverscrolling="false"
                thumbs_scrollbuttons="false"
                thumbs_scrollindicator="false"
                thumbs_loop="false"
                tooltips_buttons="false"
                tooltips_thumbs="false"
                tooltips_hotspots="false"
                tooltips_mapspots="false"
                deeplinking="false"
                loadscene_flags="MERGE"
                loadscene_blend="OPENBLEND(0.5, 0.0, 0.75, 0.05, linear)"
                loadscene_blend_prev="SLIDEBLEND(0.5, 180, 0.75, linear)"
                loadscene_blend_next="SLIDEBLEND(0.5,   0, 0.75, linear)"
                loadingtext="loading..."
                layout_width="100%"
                layout_maxwidth="814"
                controlbar_width="100%"
                controlbar_height="40"
                controlbar_offset="10"
                controlbar_offset_closed="-40"
                controlbar_overlap.no-fractionalscaling="10"
                controlbar_overlap.fractionalscaling="0"
                design_skin_images="vtourskin.png"
                design_bgcolor="0x000000"
                design_bgalpha="0.3"
                design_bgborder="0"
                design_bgroundedge="1"
                design_bgshadow="0 4 10 0x000000 0.3"
                design_thumbborder_bgborder="3 0xFFFFFF 1.0"
                design_thumbborder_padding="0"
                design_thumbborder_bgroundedge="0"
                design_text_css="color:#FFFFFF; font-family:Arial;"
                design_text_shadow="1"/>
              <action name="startup" autorun="onstart">
                if(startscene === null OR !scene[get(startscene)], copy(startscene,scene[0].name); );
                loadscene(get(startscene), null, MERGE);
                if(startactions !== null, startactions() );
              </action>
              <action name="showvideo">
                looktohotspot(get(name),90);
                videoplayer_open(%1, %2, 0.5);
              </action>
              <action name="showtext">
                set(layer[text_layer].visible, true);
                js('window.alert(1)')
              </action>
              ${isEdit ? '' : '<autorotate enabled="true" waittime="1.5" speed="2.0" />'}
              ${getScenesXML(data.scenes, data.path)}
              ${injectedXML || ''}
            </krpano>`;
  }

  function getScenesXML(scenes, id) {
    var sceneXMLList = [];
    scenes.forEach(function (scene) {
      sceneXMLList.push(getSceneXML(scene, id));
    });

    return sceneXMLList.join('');
  }

  function getSceneXML(scene, id) {
    var hotspots = scene.hotspots || [];
    var hotspotXMLList = [];
    var sceneXML = '';

    hotspots.forEach(function (hotspot) {
      hotspotXMLList.push(getHotspotXML(hotspot));
    });

    sceneXML = `
      <scene name="${scene.name}" title="" onstart="" thumburl="${scene.thumb}" lat="" lng="" heading="">
        <view hlookat="${scene.hlookat}" vlookat="${scene.vlookat}" fovtype="MFOV" fov="120" fovmin="50" fovmax="160" limitview="auto" />
        <preview url="${scene.preview}" />
        <image>
          <cube url="${scene.cube}" />
        </image>
        ${hotspotXMLList.join('')}
      </scene>`;

    return sceneXML.trim();
  }

  function getHotspotsXML(hotspots) {
    var hotspotXMLList = [];
    hotspots.forEach(function (hotspot) {
      hotspotXMLList.push(getHotspotXML(hotspot));
    });

    return hotspotXMLList.join('');
  }

  function getHotspotXML(hotspot) {
    var type = hotspot.type;
    var hotspotXML = '';
    var extra = hotspot.extra || {};
    switch (type) {
      case 'tour':
        hotspotXML = `<hotspot name="${hotspot.name}" url="${hotspot.url}" ath="${hotspot.ath}" atv="${hotspot.atv}" onclick="loadscene(${extra.scene},null,MERGE,BLEND(1));" />`;
        break;
      case 'link':

        break;
      case 'text':
        var textLayer = 'text_layer_' + index++;
        hotspotXML = `
          <hotspot name="${hotspot.name}" url="${hotspot.url}" ath="${hotspot.ath}" atv="${hotspot.atv}" onclick="set(layer[${textLayer}].visible, true);set(layer[${textLayer}].alpha, 1);" />
          <layer name="${textLayer}"
            visible="false"
            keep="false"
            type="text"
            align="top" y="15" width="70%"
            html="${extra.text}"
            css="color:#FFFFFF; font-size:14px; text-align:center; font-weight:normal; background: rgba(45, 131, 239, 0.62); border-radius: 10px; padding: 10px; max-height: 300px; overflow: auto;"
            bg="false"
            onclick="set(visible,false); tween(alpha,0);"
            />
          `;
        break;
      case 'video':
        hotspotXML = `<hotspot name="${hotspot.name}" url="${hotspot.url}" ath="${hotspot.ath}" atv="${hotspot.atv}" onclick="showvideo(${extra.video},'');" />`;
        break;
      default:

        break;
    }

    return hotspotXML;
  }

  return {
    getXML,
    getSceneXML,
    getHotspotXML
  };
})();