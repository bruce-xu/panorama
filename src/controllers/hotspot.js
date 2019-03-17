const fs = require('fs');
const path = require('path');
const config = require('../config');
const random = require('../utils/random');
const Response = require('../utils/response');
const HotspotModel = require('../models/hotspot');

function create(data) {
  if (!data.name) {
    data.name = random();
  }
  return HotspotModel.create(data)
    .then((id) => {
      return Response.success({id});
    });
}

function update(data, query) {
  return HotspotModel.update(data, query)
    .then(() => {
      return Response.success();
    });
}

function getDetail(id) {
  return HotspotModel.getDetail(id);
}

function getList(query) {
  return HotspotModel.query(query);
}

module.exports = {
  create,
  update,
  getDetail,
  getList
};