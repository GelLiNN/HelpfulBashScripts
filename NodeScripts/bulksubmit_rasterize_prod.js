var request = require('request');
var fs = require('fs');
var Promise = require('bluebird');
var zlib = require('zlib');
var _ = require('underscore');

var cids = [
    /*'556603',
    '556607',
    '556606',
    '556605',
    '556603',
    '556602',
    '552985',
    '552979',
    '552977',
    '552975',
    '552652',
    '552651',
    '551548',
    '551545',
    '556609',
    */'551917',
    '551542',
    '551533',
    '551532',
    '551528',
    '551527',
    '551525',
    '551525',
    '551523',
    /*'551521',*/
    '551520',
    '551519',
    '551516'/*,
    '551531',
    '551529',
    '551512',
    '551506',
    '563503',
    '556608'*/];

//transform creative into editor json format for screenshot service
var transformCreative = function(creative) {
    var transformedCreative = JSON.parse(JSON.stringify(creative));
    //properties need to be moved up one level for editor json
    transformedCreative.sizes = {};
    transformedCreative.sizes[creative.size] = creative.creative;
    transformedCreative.defaultPalette = creative.creative.defaultPalette;
    transformedCreative.palettes = creative.creative.palettes;
    transformedCreative.fonts = creative.creative.fonts;
    transformedCreative.originalTemplateName = creative.creative.originalTemplateName;
    transformedCreative.assetsConverted = creative.creative.assetsConverted;
    transformedCreative.transitions = creative.creative.transitions;
    transformedCreative.baseUrl = creative.creative.baseUrl;
    transformedCreative.formatVersion = creative.creative.formatVersion;
    transformedCreative.templateVersion = creative.creative.templateVersion;
    transformedCreative.selectedSize = creative.size;
    //not actually necessary but just to reduce the request body size
    delete transformedCreative['creative'];
    delete transformedCreative['size'];
    return transformedCreative;
};


var heightMap = {
    medium_rectangle: 250,
    skyscraper: 600,
    leaderboard: 90,
    smartphone_wide_banner: 50,
    smartphone_banner: 50,
    halfpage: 600,
    w728_h90_pdesktop: 90,
    w160_h600_pdesktop: 600,
    w300_h600_pdesktop: 600,
    w320_h50_pmobile: 50,
    w300_h50_pmobile: 50,
    w300_h250_pdesktop: 250
};

var widthMap = {
    medium_rectangle: 300,
    skyscraper: 160,
    leaderboard: 728,
    smartphone_wide_banner: 320,
    smartphone_banner: 300,
    halfpage: 300,
    w728_h90_pdesktop: 728,
    w160_h600_pdesktop: 160,
    w300_h600_pdesktop: 300,
    w320_h50_pmobile: 320,
    w300_h50_pmobile: 300,
    w300_h250_pdesktop: 300
};

var timestamp = new Date().getTime();

var cidmap = {};
var cidresults = {};
var uuidmap = {};
var folder = '/Users/MasterOfTheUniverse/dev/thunder/rasterized_IHG_test_' + timestamp;

fs.mkdirSync(folder);

var getUUID = function (cid) {
    return new Promise(function (resolve, reject) {

        var options = {
            url: 'https://www.placelocal.com/api/v2/campaign/' + cid + '/uuid?clearance=81dc9b&clearanceid=1234',
            headers: {'pl-service-identifier': 'campaign-audit-service',
                'pl-secret': 'rD5LghK5dzDnt4xkkwP9lfXk0neSvK98RE7o40j9'}
        };


        request.get(options, function (error, response, body) {
            if (error) {
                console.log('ERROR', cid, error, response);
                reject(error);
            } else {
                var uuid = JSON.parse(body).data;
                uuidmap[uuid] = cid;
                resolve(uuid);
            }
        });
    });
};

var getTbsJson = function (uuid) {
    return new Promise(function (resolve, reject) {

        var options = {
            url: 'http://storage.prod.paperg.com/template-build-service/release/campaigns/v3.placelocal.com/' + uuid + '/creatives.json'
        };

        request.get(options, function (error, response, body) {
            if (error) {
                console.log('ERROR', error, response);
                reject(error);
            } else {
                try {
                    var json = JSON.parse(body);
                    resolve(json);
                } catch (e) {
                    console.log('COULDNT FIND JSON FOR: ', uuidmap[uuid], uuid);
                    reject(uuid);
                }

            }
        });
    });
};


var submitToTBS = function (uuid, cid, creatives) {
    return new Promise(function (resolve, reject) {
        request.post({
            url: 'http://api.release.template-build-service.prod.paperg.com:5000/campaigns/v3.placelocal.com/' + uuid + '/creatives?rasterize=true&photo.scale=1',
            json: creatives
        }, function (error, response, body) {
            if (error) {
                console.log('FAILED FOR UUID: ', uuid);
                reject(error);

            } else {
                console.log(_.values(body));
                resolve(body);
            }
        });

    });
};

var createFragments = function (cid, uuid, creativeJS) {
    fs.mkdirSync(folder + '/' + cid);
    var createFragmentAndStore = function (j2hurl, fwurl, creativeSize, name) {
        var html = "<html>";

        if (creativeSize === 'skyscraper' || creativeSize === 'halfpage' || creativeSize === 'w160_h600_pdesktop' || creativeSize === 'w300_h600_pdesktop') {
            html += "<head><style>.previewContainer {float:left;padding-left: 20px;}</style></head>";

        }

        html += "<body>";

        if (creativeSize === 'skyscraper' || creativeSize === 'halfpage' || creativeSize === 'w160_h600_pdesktop' || creativeSize === 'w300_h600_pdesktop') {
            html += "<div class=\'previewContainer\'><H2>0.10</H2>";
        } else {
            html += "<td><H2>non-rasterized</H2></td>";
        }

        html += "<iframe frameborder=\'0\' scrolling=\'no\' marginwidth=\'0\' marginheight=\'0\' height=\'";
        html += heightMap[creativeSize];
        html += "\' width=\'";
        html += widthMap[creativeSize];

        html += "\' src=\'http://ak-cdn.placelocal.com/js/v3/iframetag?creativeUrl=";

        html += j2hurl;
        html += "&dimension_name=";
        html += creativeSize;

        html += "\'></iframe>";

        if (creativeSize === 'skyscraper' || creativeSize === 'halfpage' || creativeSize === 'w160_h600_pdesktop' || creativeSize === 'w300_h600_pdesktop') {
            html += "</div><div class=\'previewContainer\'><H2>0.9</H2>";
        } else {
            html += "<td><H2>rasterized</H2></td>";
        }

        html += "<iframe frameborder=\'0\' scrolling=\'no\' marginwidth=\'0\' marginheight=\'0\' height=\'";
        html += heightMap[creativeSize];
        html += "\' width=\'";
        html += widthMap[creativeSize];

        html += "\' src=\'http://ak-cdn.placelocal.com/js/v3/iframetag?creativeUrl=";

        html += fwurl;
        html += "&dimension_name=";
        html += creativeSize;

        html += "\'></iframe>";

        if (creativeSize === 'skyscraper' || creativeSize === 'halfpage') {
            html += "</div>";
        }
        html += "</body></html>";

        fs.writeFileSync(folder + '/' + cid + '/' + name + '.html', html);

        var creativeJSON = fwurl + 'on';

        var reqOptions = {
            url: creativeJSON,
            encoding: null
        };

        request.get(reqOptions, function (error, response, body) {
            if (error) {
                console.log('ERROR', error, response);
            } else {
                try {
                    zlib.gunzip(body, function(err, dezipped) {
                        if (dezipped && !(typeof dezipped === 'undefined')) {
                            var json = JSON.parse(dezipped.toString());
                            fs.writeFileSync(folder + '/' + cid + '/' + name + '.json', JSON.stringify(transformCreative(json)));
                        }
                    });

                } catch (e) {
                    console.log('FAILED: ', e.stack);
                }

            }
        });


    };

    Object.keys(creativeJS).forEach(function (size) {
        cidresults[cid] = {};
        cidresults[cid][size] = {};
        var url = 'http://storage.prod.paperg.com/template-build-service/release/campaigns/v3.placelocal.com/' + uuid;
        cidresults[cid][size]['non-rasterized'] = url + '/creatives/' + size + '.js';;
        cidresults[cid][size]['rasterized'] = url + '/creatives/' + size + '.js';

        createFragmentAndStore(cidresults[cid][size]['non-rasterized'], cidresults[cid][size]['rasterized'], size, cid + '_' + size + '_' + timestamp );
    });
};


var getAndSubmit = function (cid) {
    var campaignUUID;
    return getUUID(cid)
        .then(function (uuid) {
            cidmap[cid] = uuid;
            campaignUUID = uuid;
            return getTbsJson(uuid);
        })
        .then(function (json) {
            return submitToTBS(cidmap[cid], cid, json);
        })
        .then(function (creatives) {
            createFragments(cid, campaignUUID, creatives);

        })
};

var process = function () {
    console.log('SUBMITTING');
    Promise.map(cids, getAndSubmit)
        .then(function () {
            console.log('DONE: ', cidmap);
        });

};

process();
