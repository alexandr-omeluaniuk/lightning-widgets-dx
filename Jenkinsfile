#!groovy
import groovy.json.JsonSlurperClassic
node {
    def HUB_ORG=env.HUB_ORG_DH
    def SFDC_HOST = env.SFDC_HOST_DH
    def JWT_KEY_CRED_ID = env.JWT_CRED_ID_DH
    def CONNECTED_APP_CONSUMER_KEY=env.CONNECTED_APP_CONSUMER_KEY_DH

    def SFDC_USERNAME
    def BUILD_NUMBER=env.BUILD_NUMBER
    def RUN_ARTIFACT_DIR="tests/${BUILD_NUMBER}"

    // Development org
    def SS_DEV_HUB_ORG=env.SS_DEV_HUB_ORG_DH
    def SS_DEV_JWT_KEY_CRED_ID = env.SS_DEV_JWT_CRED_ID_DH
    def SS_DEV_CONNECTED_APP_CONSUMER_KEY=env.SS_DEV_CONNECTED_APP_CONSUMER_KEY_DH

    stage('checkout source') {
        // when running in multi-branch job, one must issue this command
        checkout scm
    }

    withCredentials([file(credentialsId: JWT_KEY_CRED_ID, variable: 'jwt_key_file')]) {
        stage('Create Scratch Org') {

            rc = sh returnStatus: true, script: "sfdx force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile ${jwt_key_file} --setdefaultdevhubusername --instanceurl ${SFDC_HOST} -a TrialDX"
            if (rc != 0) { error 'hub org authorization failed' }

            // need to pull out assigned username
            rmsg = sh returnStdout: true, script: "sfdx force:org:create --definitionfile config/jenkins-test-scratch-def.json --json --setdefaultusername"
            printf rmsg
            def jsonSlurper = new JsonSlurperClassic()
            def robj = jsonSlurper.parseText(rmsg)
            if (robj.status != 0) { error 'org creation failed: ' + robj.message }
            SFDC_USERNAME=robj.result.username
            robj = null
        }
//        stage('Push To Test Org') {
//            rc = sh returnStatus: true, script: "sfdx force:source:push --targetusername ${SFDC_USERNAME}"
//            if (rc != 0) {
//                error 'push all failed'
//            }
//        }
//        stage('Run Apex Test') {
//            sh "mkdir -p ${RUN_ARTIFACT_DIR}"
//            timeout(time: 120, unit: 'SECONDS') {
//                rc = sh returnStatus: true, script: "sfdx force:apex:test:run --testlevel RunLocalTests --outputdir ${RUN_ARTIFACT_DIR} --resultformat tap --targetusername ${SFDC_USERNAME}"
//                if (rc != 0) {
//                    error 'apex test run failed'
//                }
//            }
//        }
//
//        stage('collect results') {
//            junit keepLongStdio: true, testResults: 'tests/**/*-junit.xml'
//        }
        stage('Delete Test Org') {
            timeout(time: 120, unit: 'SECONDS') {
                rc = sh returnStatus: true, script: "sfdx force:org:delete --targetusername ${SFDC_USERNAME} --noprompt"
                if (rc != 0) {
                    error 'org deletion request failed'
                }
            }
        }
    }

    withCredentials([file(credentialsId: SS_DEV_JWT_KEY_CRED_ID, variable: 'jwt_key_file')]) {
        stage('Connect to Development org') {
            rc = sh returnStatus: true, script: "sfdx force:auth:jwt:grant --clientid ${SS_DEV_CONNECTED_APP_CONSUMER_KEY} --username ${SS_DEV_HUB_ORG} --jwtkeyfile ${jwt_key_file} --setdefaultdevhubusername --instanceurl ${SFDC_HOST} -a SSDev"
            if (rc != 0) {
                error 'SSDev org authorization failed'
            }
        }
        stage('Convert project to Metadata API') {
            rc = sh returnStatus: true, script: "mkdir mdapi_output_dir"
            rc = sh returnStatus: true, script: "sfdx force:source:convert -d mdapi_output_dir/ --json"
            println rc
        }
        stage('Deploye to Development org') {
            rc = sh returnStatus: true, script: "sfdx force:mdapi:deploy -d mdapioutput/ -u SSDev -w 10 --json"
            println rc
        }
    }
}