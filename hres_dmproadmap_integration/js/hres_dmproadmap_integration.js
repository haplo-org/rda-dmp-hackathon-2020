
/*
    NOTE: This is Proof of Concept code produced at a Hackday. It SHOULD NOT be used in 
    production as-is.

    The integration requires an APIClient account for a development DMPRoadmap application.
    These credentuals should be saved securely in the Haplo keychain (https://docs.haplo.org/plugin/o/keychain)
    using the CREDENTIAL_NAME below.

    You will need to update the API_BASE_URL to point to the correct DMPRoadmap application.
*/

var CREDENTIAL_NAME = "DMPRoadmap/DMPOnline API key";
var API_BASE_URL = "http://dmptool-stg.cdlib.org/api/v1";

// --------------------------------------------------------------------------
// Pushing and pullings DMPs from DMPRoadmap/DMPOnline

P.implementService("hres-data-management-plans:integration:push-to-external-system", function(dmp) {
    createDMPRoadmapDMP(dmp);
});
P.implementService("hres-data-management-plans:integration:pull-from-external-system", function(project, systemName, systemId) {
    if(systemName === "DMPRoadmap") {
        readDMPFromDMPRoadmap(project, systemId);
    }
});

var createDMPRoadmapDMP = function(dmp) {
    withToken(PushDMPToDMPRoadmap, {dmp: dmp});
};

var readDMPFromDMPRoadmap = function(project, dmpId) {
    withToken(GetDMPFromDMPRoadmap, {
        project: project.ref.toString(),
        id: dmpId
    });
};

var withToken = function(callback, data) {
    let credential = O.keychain.credential(CREDENTIAL_NAME);
    O.httpClient(API_BASE_URL+"/authenticate").
        method("POST").
        header("Accept", "application/json").
        body("application/x-www-form-urlencoded;charset=UTF-8", JSON.stringify({
            "grant_type": "client_credentials",
            "client_id": credential.account.Username,
            "client_secret": credential.secret.Password
        })).
        request(callback, data);
};

var PushDMPToDMPRoadmap = P.callback("push-dmp-to-dmproadmap", function(data, tokenClient, response) {
    if(response.successful) {
        let token = JSON.parse(response.body.readAsString());
        O.httpClient(API_BASE_URL+"/plans").
            method("POST").
            header("Accept", "application/json").
            header("Authorization", "Bearer "+token.access_token).
            body("application/x-www-form-urlencoded;charset=UTF-8", JSON.stringify({
                total_items:1,
                items: [{dmp: data.dmp}]
            })).
            request(CreatedDMP, data);
    } else {
        console.log("DMPRoadmap returned an error after authenticating: "+response.errorMessage);
    }
});

var CreatedDMP = P.callback("created-dmproadmap-dmp", function(data, client, response) {
    if(response.successful) {
        console.log("Created DMPRoadmap DMP successfully");
    } else {
        console.log("Failed to create DMPRoadmap DMP");
    }
    console.log(response.body.readAsString());
});

var GetDMPFromDMPRoadmap = P.callback("read-dmp-from-dmproadmap", function(data, tokenClient, response) {
    if(response.successful) {
        console.log("Retrieved web token");
        let token = JSON.parse(response.body.readAsString());
        O.httpClient(API_BASE_URL+"/plans/"+data.id).
            method("GET").
            header("Accept", "application/json").
            header("Authorization", "Bearer "+token.access_token).
            request(RetrievedDMP, data);
    } else {
        console.log("DMPRoadmap returned an error after authenticating: "+response.errorMessage);
    }
});

var RetrievedDMP = P.callback("retrieved-dmproadmap-dmp", function(data, client, response) {
    if(response.successful) {
        console.log("Retrieved DMP successfully");
        let project = O.ref(data.project);
        let dmp = JSON.parse(response.body.readAsString());
        O.service("hres:data_management_plans:update_dmp_for_project", project, dmp.items[0].dmp);
    } else {
        console.log("Failed to retrieve DMP: "+response.errorMessage);
    }
});
