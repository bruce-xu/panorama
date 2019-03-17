(function() {
  let id = document.getElementById('panoramaId').value;
  let file = document.getElementById('file');
  let generate = document.getElementById('generate');
  let images = document.getElementById('images');

  file.addEventListener('change', upload);

  generate.addEventListener('click', generateH5);

  /**
   * 上传图片
   */
  function upload(e) {
    let formData = new FormData();
    let files = e.target.files || [];
    for (let i = 0, len = files.length; i < len; i++) {
      formData.append('files[]', files[i]);
    }

    Http.upload(`/api/panoramas/${id}/upload`, formData)
      .then(function (data) {
        if (data.length) {
          for (let i = 0; i < data.length; i++) {
            let img = document.createElement('img');
            img.src= data[i];
            images.append(img);
          }

          generate.style.display = 'inline-block';
        }
      })
      .catch(function (err) {
        Toast.show('上传失败，请重试');
      });
  }

  /**
   * 生成全景图
   */
  function generateH5() {
    Http.post(`/api/panoramas/${id}/generate`)
      .then(function (data) {
        Toast.show('全景H5生成成功', function () {
          location.href = `/page/panoramas/${id}/edit`;
        });
      }).catch(function () {
        Toast.show('全景H5生成失败，请重试');
      });
  }
})();