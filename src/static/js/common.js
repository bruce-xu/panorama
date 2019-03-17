/**
 * 加载框
 */
window.Loading = (function () {
  function show() {
    document.getElementById('loading').style.display = 'block';
  }

  function hide() {
    document.getElementById('loading').style.display = 'none';
  }

  return {
    show,
    hide
  };
})();


/**
 * 提示框
 */
window.Toast = (function () {
  function show(text, callback) {
    const toast = document.createElement('div');
    toast.style = 'position: fixed; left: 50%; top: 50%; z-index: 100; transform: translate(-50%,-50%); background: rgba(0,0,0,.5); padding: 10px; min-width: 200px; text-align: center; border-radius: 15px; color: #FFF; font-weight: bold; line-height: 1.6;';
    toast.innerHTML = text || '';
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.remove();
      callback && callback();
    }, 2000);
  }

  return {
    show
  };
})();


/**
 * 对话框
 */
window.Dialog = (function () {
  function show(options) {
    const {title, content, type = 'confirm', onConfirm, onCancel} = options || {};

    const dialog = document.createElement('div');
    dialog.className = 'dialog';

    const mask = document.createElement('div');
    mask.className = 'dialog-mask';

    const dialogBody = document.createElement('div');
    dialogBody.className = 'dialog-body';

    const dialogTitle = document.createElement('h3');
    dialogTitle.className = 'dialog-title';

    const dialogContent = document.createElement('div');
    dialogContent.className = 'dialog-content';

    const dialogBtns = document.createElement('div');
    dialogBtns.className = 'dialog-btns';

    const confirmBtn = document.createElement('button');
    confirmBtn.innerHTML = '确定';

    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '取消';
    cancelBtn.style = 'margin-left: 20px';

    document.body.appendChild(dialog);

    dialog.appendChild(mask);
    dialog.appendChild(dialogBody);

    dialogBody.appendChild(dialogTitle);
    dialogBody.appendChild(dialogContent);
    dialogBody.appendChild(dialogBtns);

    dialogBtns.appendChild(confirmBtn);
    if (type === 'confirm') {
      dialogBtns.appendChild(cancelBtn);
    }

    if (title) {
      if (title instanceof Element) {
        dialogTitle.appendChild(title);
      } else {
        dialogTitle.innerHTML = title;
      }
    }
    if (content) {
      if (content instanceof Element) {
        dialogContent.appendChild(content);
      } else {
        dialogContent.innerHTML = content;
      }
    }

    confirmBtn.onclick = function () {
      const result = onConfirm && onConfirm();
      if (result !== false) {
        dialog.remove();
      }
    };

    cancelBtn.onclick = function () {
      const result = onCancel && onCancel();
      if (result !== false) {
        dialog.remove();
      }
    };
  }

  return {
    show
  };
})();


/**
 * HTTP请求
 */
window.Http = (function () {
  function request(url, options) {
    Loading.show();
    return fetch(url, options)
      .then(response => response.json())
      .then(res => {
        Loading.hide();
        if (res && res.code === 0) {
          return Promise.resolve(res.data || {});
        } else {
          return Promise.reject(res);
        }
      })
      .catch(err => {
        Loading.hide();
        return Promise.reject(err);
      });
  }

  function query(url, data) {
    if (data) {
      let queryArr = '';
      for (let key in data) {
        queryArr.push(key + '=' + encodeURIComponent(data[key]));
      }
      url += (url.indexOf('?') > -1 ? '&' : '?') + queryArr.join('&');
    }
    return request(url);
  }

  function create(url, data) {
    return request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      headers: {'Content-Type': 'application/json'}
    });
  }

  function update(url, data) {
    return request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      headers: {'Content-Type': 'application/json'}
    });
  }

  function del(url, data) {
    return request(url, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : null,
      headers: {'Content-Type': 'application/json'}
    });
  }

  function upload(url, data) {
    return request(url, {
      method: 'POST',
      body: data
    });
  }

  return {
    query,
    create,
    update,
    del,
    upload,
    post: create,
    put: update
  };
})();


/**
 * 工具类
 */
window.Utils = (function () {
  /**
   * 首字母大写
   */
  function capitalize(text) {
    if (text) {
      return text.substr(0, 1).toUpperCase() + text.substr(1);
    }

    return text;
  }

  return {
    capitalize
  };
})();