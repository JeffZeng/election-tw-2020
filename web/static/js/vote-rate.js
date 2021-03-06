// Generated by LiveScript 1.3.1
(function(){
  var getHandler, popup1, popup2, lc;
  getHandler = function(range, colorspace, prec, inverse, scale){
    prec == null && (prec = 1);
    inverse == null && (inverse = false);
    scale == null && (scale = d3.interpolateRdBu);
    return {
      label: {
        list: function(){
          var a, res$, i$, step$, to$, ridx$, b;
          res$ = [];
          for (i$ = range.max, to$ = range.avg, step$ = -(range.max - range.avg) / 3; step$ < 0 ? i$ >= to$ : i$ <= to$; i$ += step$) {
            ridx$ = i$;
            res$.push(ridx$);
          }
          a = res$;
          res$ = [];
          for (i$ = range.avg, to$ = range.min, step$ = -(range.avg - range.min) / 3; step$ < 0 ? i$ >= to$ : i$ <= to$; i$ += step$) {
            ridx$ = i$;
            res$.push(ridx$);
          }
          b = res$;
          a.splice(a.length - 1, 1);
          return a.concat(b);
        },
        handle: function(arg$){
          var data, node, v;
          data = arg$.data, node = arg$.node;
          v = colorspace(data);
          ld$.find(node, '.dot', 0).style.background = scale(inverse ? 1 - v : v);
          return ld$.find(node, '.name', 0).innerHTML = ((data === range.avg ? "<span class='text-sm'>(全國平均)</span>" : '') + "") + (Math.round(data * 100 * prec) / prec + "%");
        }
      }
    };
  };
  popup1 = popupWrap(function(arg$){
    var data, evt, node, obj;
    data = arg$.data, evt = arg$.evt, node = arg$.node;
    obj = lc.hash[data.properties.name];
    return node.innerHTML += "<div>" + Math.round(1000 * obj.vote / obj.total) / 10 + "%</div>";
  });
  popup2 = popupWrap(function(arg$){
    var data, evt, node, obj;
    data = arg$.data, evt = arg$.evt, node = arg$.node;
    obj = lc.hash[data.properties.name];
    return node.innerHTML += "<div>" + Math.round(1000 * (obj.vote - obj.valid) / obj.vote) / 10 + "%</div>";
  });
  lc = {};
  lc.obj1 = pdmaptw.create({
    root: ld$.find(document, '#map-vote-rate', 0),
    type: 'town',
    popup: popup1
  });
  lc.obj2 = pdmaptw.create({
    root: ld$.find(document, '#map-invalid-rate', 0),
    type: 'town',
    popup: popup2
  });
  return lc.obj1.init().then(function(){
    return lc.obj2.init();
  }).then(function(){
    return ld$.fetch("assets/data/投票數.json", {
      method: 'GET'
    }, {
      type: 'json'
    });
  }).then(function(data){
    var res$, k, ref$, v, list, vr;
    lc.hash = data;
    res$ = [];
    for (k in ref$ = lc.hash) {
      v = ref$[k];
      res$.push(v);
    }
    lc.list = res$;
    list = lc.list.map(function(it){
      return it.vote / it.total;
    });
    lc.voteRate = vr = {
      min: Math.min.apply(null, list),
      max: Math.max.apply(null, list),
      avg: lc.hash["全國"].vote / lc.hash["全國"].total
    };
    list = lc.list.map(function(it){
      return (it.vote - it.valid) / it.vote;
    });
    return lc.invalidRate = {
      min: Math.min.apply(null, list),
      max: Math.max.apply(null, list),
      avg: (lc.hash["全國"].vote - lc.hash["全國"].valid) / lc.hash["全國"].vote
    };
  }).then(function(){
    var colorspace, range, obj, view;
    colorspace = function(v){
      return v = v > range.avg
        ? 0.5 * (v - range.avg) / (range.max - range.avg) + 0.5
        : 0.5 * (v - range.min) / (range.avg - range.min);
    };
    range = lc.voteRate;
    obj = lc.obj1;
    obj.fit();
    d3.select(obj.root).selectAll('path').attr('fill', function(it){
      var name;
      name = it.properties.name;
      return d3.interpolateRdBu(colorspace(lc.hash[name].vote / lc.hash[name].total));
    }).attr('stroke', function(){
      return '#fff';
    }).attr('stroke-width', function(){
      return 0.005;
    });
    return view = new ldView({
      root: '[ld-scope=vote-rate]',
      handler: getHandler(range, colorspace, 1)
    });
  }).then(function(){
    var colorspace, range, obj, view;
    colorspace = function(v){
      return v = v > range.avg
        ? 0.5 * (v - range.avg) / (range.max - range.avg) + 0.5
        : 0.5 * (v - range.min) / (range.avg - range.min);
    };
    range = lc.invalidRate;
    obj = lc.obj2;
    obj.fit();
    d3.select(obj.root).selectAll('path').attr('fill', function(it){
      var name;
      name = it.properties.name;
      return d3.interpolatePiYG(1 - colorspace((lc.hash[name].vote - lc.hash[name].valid) / lc.hash[name].vote));
    }).attr('stroke', function(){
      return '#000';
    }).attr('stroke-width', function(){
      return 0.00;
    });
    return view = new ldView({
      root: '[ld-scope=invalid-rate]',
      handler: getHandler(range, colorspace, 100, true, d3.interpolatePiYG)
    });
  });
})();