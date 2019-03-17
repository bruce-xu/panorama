(function () {
  check();

  document.getElementById('help').addEventListener('click', function () {
    Dialog.show({
      title: '说明',
      content: document.getElementById('tips').cloneNode(true)
    });
  });

  document.getElementById('createBtn').addEventListener('click', function () {
    const input = document.createElement('input');
    input.id = 'panoramaName';
    input.placeholder = '请输入全景项目名称';

    Dialog.show({
      title: '创建全景项目',
      content: input,
      onConfirm: create
    });
  });

  document.querySelector('table').addEventListener('click', function (e) {
    var target = e.target;
    if (target.className === 'delete') {
      e.preventDefault();
      e.stopPropagation();
      var id = target.dataset.id;
      var name = target.dataset.name;
      if (id) {
        Dialog.show({
          title: '删除全景项目',
          content: '确认删除当前项目？',
          onConfirm: del.bind(null, id, name)
        });
      }
    }
  });

  // 判断是否有配置过 Krpano 路径
  function check() {
    var configured = document.getElementById('configured').value;
    if (configured === 'false') {
      var input = document.createElement('input');
      input.placeholder = '请输入 Krpano 的安装路径';
      Dialog.show({
        title: '请配置 Krpano 安装路径',
        content: input,
        type: 'info',
        onConfirm: function () {
          var krpanoPath = input.value.trim();
          if (!krpanoPath) {
            Toast.show('请输入 Krpano 的安装路径');
            return false;
          }

          Http.create('/api/configs', {
            'krpano_path': krpanoPath
          }).then(() => {
            Toast.show('配置成功');
          }, () => {
            Toast.show('配置失败');
          });
        }
      });
    }
  }

  // 创建全景项目
  function create() {
    const name = document.getElementById('panoramaName').value.trim();
    if (!name) {
      Toast.show('请输入全景项目名称');
      return true;
    }

    Http.create('/api/panoramas', {name: name})
      .then(function (id) {
        Toast.show(`全景项目【${name}】创建成功，请上传项目图片`, function () {
          location.href = `/page/panoramas/${id}/edit`;
        });
      });
  }

  // 删除全景项目
  function del(id, name) {
    Http.del(`/api/panoramas/${id}`)
      .then(function (id) {
        Toast.show(`全景项目【${name}】删除成功`, function () {
          location.reload();
        });
      });
  }
})();