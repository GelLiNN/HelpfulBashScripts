var request = require('request');
var fs = require('fs');
var Promise = require('bluebird');
var zlib = require('zlib');

var cids = [
   '450751',
    '452193',
    '453815',
    '455899',
    '458550',
    '463547',
    '466545',
    '472304',
    '476555',
    '479026',
    '479739',
    '482336',
    '483644',
    '484123',
    '484629',
    '485454',
    '486015',
    '488452',
    '488457',
    '488766',
    '491326',
    '491996',
    '494006',
    '494699',
    '495345',
    '496912',
    '498422',
    '499268',
    '499883',
    '500154',
    '501107',
    '501432',
    '502939',
    '503964',
    '504310',
    '504629',
    '505156',
    '505418',
    '505648',
    '505660',
    '505799',
    '507149',
    '507164',
    '507910',
    '509020',
    '509320',
    '509504',
    '510521',
    '510690',
    '511577',
    '511757',
    '511760',
    '512011',
    '512665',
    '512789',
    '513686',
    '513853',
    '514275',
    '505156',
    '505418',
    '505648',
    '505660',
    '505799',
    '507149',
    '507164',
    '507910',
    '509020',
    '509320',
    '509504',
    '510521',
    '510690',
    '511577',
    '511757',
    '511760',
    '512011',
    '512665',
    '512789',
    '513686',
    '513853',
    '514275',
    '514492',
    '514841',
    '515783',
    '516530',
    '516635',
    '516672',
    '516895',
    '516906',
    '517136',
    '517875',
    '518476',
    '518616',
    '518692',
    '518750',
    '518803',
    '519292',
    '519449',
    '519521',
    '519556',
    '519586',
    '519605',
    '519658',
    '519679',
    '519816',
    '520280',
    '520315',
    '520355',
    '520367',
    '520467',
    '520562',
    '520633',
    '520678',
    '520691',
    '520713',
    '520950',
    '520951',
    '520967',
    '521364',
    '522206',
    '522715',
    '522787',
    '523025',
    '523286',
    '523522',
    '523663',
    '523796',
    '523799',
    '523802',
    '523806',
    '523810',
    '524072',
    '524200',
    '524243',
    '524245',
    '524256',
    '524276',
    '524541',
    '524709',
    '524845',
    '525102',
    '525358',
    '525370',
    '525381',
    '525491',
    '525560',
    '525768',
    '525798',
    '526067',
    '526270',
    '526366',
    '526509',
    '526589',
    '526671',
    '526949',
    '527009',
    '527088',
    '527138',
    '527157',
    '527288',
    '527289',
    '527524',
    '527660',
    '527664',
    '527670',
    '527688',
    '527706',
    '527719',
    '527794',
    '527836',
    '527870',
    '527920',
    '528070',
    '528223',
    '528356',
    '528616',
    '528896',
    '528922',
    '528928',
    '529352',
    '529658',
    '529923',
    '530000',
    '530137',
    '530240',
    '530469',
    '530557',
    '530664',
    '530736',
    '530742',
    '530749',
    '530762',
    '530836',
    '530944',
    '531015',
    '531053',
    '531169',
    '531213',
    '531238',
    '531285',
    '531351',
    '531525',
    '531534',
    '531548',
    '531566',
    '531584',
    '531642',
    '531645',
    '531676',
    '531771',
    '531852',
    '531886',
    '531976',
    '532000',
    '532046',
    '532077',
    '532082',
    '532199',
    '532222',
    '532230',
    '532239',
    '532245'];

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
    halfpage: 600
};

var widthMap = {
    medium_rectangle: 300,
    skyscraper: 160,
    leaderboard: 728,
    smartphone_wide_banner: 320,
    smartphone_banner: 300,
    halfpage: 300
};

var timestamp = new Date().getTime();

var cidmap = {};
var cidresults = {};
var uuidmap = {};
var folder = '/Users/MasterOfTheUniverse/j2htest_' + timestamp;

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
            url: 'http://api.master.template-build-service.staging.paperg.com:5000/campaigns/v3.placelocal.com/' + uuid + '_j2htest_' + timestamp + '/creatives',
            json: creatives
        }, function (error, response, body) {
            if (error) {
                console.log('FAILED FOR UUID: ', uuid);
                reject(error);

            } else {
                resolve(body);
            }
        });

    });
};

var createFragments = function (cid, uuid, creativeJS) {

    fs.mkdirSync(folder + '/' + cid);
    var createFragmentAndStore = function (j2hurl, fwurl, creativeSize, name) {
        var html = "<html>";

        if (creativeSize === 'skyscraper' || creativeSize === 'halfpage') {
            html += "<head><style>.previewContainer {float:left;padding-left: 20px;}</style></head>";

        }

        html += "<body>";

        if (creativeSize === 'skyscraper' || creativeSize === 'halfpage') {
            html += "<div class=\'previewContainer\'><H2>JSON2HTML</H2>";
        } else {
            html += "<td><H2>JSON2HTML</H2></td>";
        }

        html += "<iframe frameborder=\'0\' scrolling=\'no\' marginwidth=\'0\' marginheight=\'0\' height=\'";
        html += heightMap[creativeSize];
        html += "\' width=\'";
        html += widthMap[creativeSize];

        html += "\' src=\'http://ak-cdn.placelocalqa.com/js/v3/iframetag?creativeUrl=";

        html += j2hurl;
        html += "&dimension_name=";
        html += creativeSize;

        html += "\'></iframe>";

        if (creativeSize === 'skyscraper' || creativeSize === 'halfpage') {
            html += "</div><div class=\'previewContainer\'><H2>Framework</H2>";
        } else {
            html += "<td><H2>Framework</H2></td>";
        }

        html += "<iframe frameborder=\'0\' scrolling=\'no\' marginwidth=\'0\' marginheight=\'0\' height=\'";
        html += heightMap[creativeSize];
        html += "\' width=\'";
        html += widthMap[creativeSize];

        html += "\' src=\'http://ak-cdn.placelocalqa.com/js/v3/iframetag?creativeUrl=";

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
                        var json = JSON.parse(dezipped.toString());
                        fs.writeFileSync(folder + '/' + cid + '/' + name + '.json', JSON.stringify(transformCreative(json)));
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
        cidresults[cid][size]['j2h'] = creativeJS[size];
        cidresults[cid][size]['framework'] = 'http://storage.prod.paperg.com/template-build-service/release/campaigns/v3.placelocal.com/' + uuid + '/creatives/' + size + '.js';

        createFragmentAndStore(cidresults[cid][size]['j2h'], cidresults[cid][size]['framework'], size, cid + '_' + size + '_' + timestamp );
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
