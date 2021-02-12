const {config} = require('./common')
const qs = require('qs')
const axios = require('axios')
const {
  usernameMapperTemplate,
  lastnameMapperTemplate,
  firstnameMapperTemplate,
  spidCodeMapperTemplate,
  emailMapperTemplate,
  taxIdMapperTemplate,
  genderMapperTemplate,
  dateOfBirthMapperTemplate,
  placeOfBirthMapperTemplate,
  countyOfBirthMapperTemplate,
  mobilePhoneMapperTemplate,
  addressMapperTemplate,
  digitalAddressMapperTemplate,
  companyNameMapperTemplate,
  companyAddressMapperTemplate,
  vatNumberapperTemplate,
  patchTemplate
} = require('./common')


const tokenConfig = {
    method: 'post',
    url: config.keycloakServerBaseURL + '/auth/realms/' + config.adminRealm + '/protocol/openid-connect/token',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
        'client_id': config.adminClientId,
        'username': config.adminUsername,
        'password': config.adminPwd,
        'grant_type': 'password'
    })
};


exports.httpGrabIdPsMetadata = function () {
    return axios({
        method: 'get',
        url: config.spidMetadataOfficialURL,
        headers: {}
    })
        .catch(function (error) {
            console.log(error);
        });
}

const httpGrabKeycloaktoken = function () {
    return axios(tokenConfig)
        .then(response => response.data.access_token)
        .catch(function (error) {
            console.log(error);
        });
}

exports.httpGrabKeycloaktoken = httpGrabKeycloaktoken

exports.httpCallKeycloakImportConfig = function (idPsMetadataUrl) {
    return httpGrabKeycloaktoken().then(token => {
        let data = JSON.stringify({"providerId": "spid", "fromUrl": idPsMetadataUrl});
        let axiosConfig = {
            method: 'post',
            url: config.keycloakServerBaseURL + '/auth/admin/realms/' + config.realm + '/identity-provider/import-config',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(axiosConfig)
            .catch(function (error) {
                console.log(error);
            });
    })

}


exports.httpCallKeycloakCreateIdP = function (idPModel) {
    return httpGrabKeycloaktoken().then(token => {
        let data = JSON.stringify(idPModel);
        let axiosConfig = {
            method: 'post',
            url: config.keycloakServerBaseURL + '/auth/admin/realms/' + config.realm + '/identity-provider/instances',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(axiosConfig)
            .catch(function (error) {
                console.log(error);
            });
    })
}


exports.httpCallKeycloakDeleteIdP = function (idPAlias) {
    return httpGrabKeycloaktoken().then(token => {
        let axiosConfig = {
            method: 'delete',
            url: config.keycloakServerBaseURL + '/auth/admin/realms/' + config.realm + '/identity-provider/instances/' + idPAlias,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        };
        return axios(axiosConfig)
            .catch(function (error) {
                console.log(error);
            });
    })
}

exports.httpCallKeycloakGetIpds = function () {
    return httpGrabKeycloaktoken().then(token => {
        let axiosConfig = {
            method: 'get',
            url: config.keycloakServerBaseURL + '/auth/admin/realms/' + config.realm + '/identity-provider/instances',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        };
        return axios(axiosConfig)
            .catch(function (error) {
                console.log(error);
            });
    })
}


exports.httpCallKeycloakGetIpdDescription = function (idpAlias) {
    let axiosConfig = {
        method: 'get',
        url: config.keycloakServerBaseURL + '/auth/realms/' + config.realm + '/broker/' + encodeURIComponent(idpAlias) + '/endpoint/descriptor',
    };
    return axios(axiosConfig)
        .catch(function (error) {
            console.log(error);
        });

}


exports.httpCallKeycloakCreateAllMappers = function (idPAlias) {
    return Promise.all([
        httpCallKeycloakCreateMapper(idPAlias, usernameMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, lastnameMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, firstnameMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, spidCodeMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, emailMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, taxIdMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, genderMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, dateOfBirthMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, placeOfBirthMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, countyOfBirthMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, mobilePhoneMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, addressMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, digitalAddressMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, companyNameMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, companyAddressMapperTemplate),
        httpCallKeycloakCreateMapper(idPAlias, vatNumberapperTemplate),
    ])
}

exports.httpCallKeycloakImportRealm = function () {
    return httpGrabKeycloaktoken().then(token => {
        let data = patchTemplate('./template/realm-template.json');
        let axiosConfig = {
            method: 'post',
            url: config.keycloakServerBaseURL + '/auth/admin/realms/',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(axiosConfig)
            .catch(function (error) {
                console.log(error);
            });
    })
}


const httpCallKeycloakCreateMapper = function (idPAlias, mapperModel) {
    return httpGrabKeycloaktoken().then(token => {
        mapperModel.identityProviderAlias = idPAlias
        let data = JSON.stringify(mapperModel);
        let axiosConfig = {
            method: 'post',
            url: config.keycloakServerBaseURL + '/auth/admin/realms/' + config.realm + '/identity-provider/instances/' + idPAlias + '/mappers',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(axiosConfig)
            .catch(function (error) {
                console.log(error);
            });
    })
}
