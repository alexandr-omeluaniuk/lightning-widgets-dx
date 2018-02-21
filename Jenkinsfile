#!groovy
node {
    def HUB_ORG=env.HUB_ORG_DH
    def SFDC_HOST = env.SFDC_HOST_DH
    def JWT_KEY_CRED_ID = env.JWT_CRED_ID_DH
    def CONNECTED_APP_CONSUMER_KEY=env.CONNECTED_APP_CONSUMER_KEY_DH

    def SFDC_USERNAME

    stage('checkout source') {
        // when running in multi-branch job, one must issue this command
        checkout scm
    }
}