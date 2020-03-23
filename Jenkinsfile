#!groovy
import groovy.json.JsonSlurperClassic
node
{

//def BUILD_NUMBER=env.BUILD_NUMBER
//def RUN_ARTIFACT_DIR="tests/${BUILD_NUMBER}"
def SFDC_USERNAME="JenkinsPDO@scratchorg.com"

def HUB_ORG=env.HUB_ORG_DH
def SFDC_HOST = env.SFDC_HOST_DH
def JWT_KEY_CRED_ID = env.JWT_CRED_ID_DH
def CONNECTED_APP_CONSUMER_KEY=env.CONNECTED_APP_CONSUMER_KEY_DH

println 'KEY IS' 
println JWT_KEY_CRED_ID
println HUB_ORG
println SFDC_HOST
println CONNECTED_APP_CONSUMER_KEY
def toolbelt = tool 'toolbelt'

stage('checkout source')
{
    // when running in multi-branch job, one must issue this command
    checkout scm
}
withCredentials([file(credentialsId: JWT_KEY_CRED_ID, variable: 'jwt_key_file')])
 {
        stage('Authorizong Dev Org')
         {

             removeOrg=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:logout -u ${HUB_ORG} -p"
             rc = bat returnStatus: true, script: "\"${toolbelt}\" force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile ${jwt_key_file} --setdefaultdevhubusername --instanceurl ${SFDC_HOST}"
            if (rc != 0)
            {
              error 'hub org authorization failed' 
            }
             list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:list"
        }
        stage('Creating Scratch Org')
        {
            //rs=bat returnStatus: true, script: "\"${toolbelt}\" force:config:set defaultdevhubusername=${HUB_ORG}"
            list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:list"
            rmsg = bat returnStatus: true, script: "\"${toolbelt}\" force:org:create --definitionfile config/project-scratch-def.json -v ${HUB_ORG} username=${SFDC_USERNAME}"       
        }
        stage('Create a Password for Scratch Org')
        {
                rs=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --jwtkeyfile \"${jwt_key_file}\" --username ${SFDC_USERNAME} --instanceurl https://test.salesforce.com --setdefaultusername"
                rc=bat returnStatus: true, script: "\"${toolbelt}\" force:user:password:generate --targetusername ${SFDC_USERNAME}"
                rS=bat returnStatus: true, script: "\"${toolbelt}\" force:user:display --targetusername ${SFDC_USERNAME}"

        }
        stage('Retrive Data from scratch Org')
        {
             vk=bat returnStatus: true, script: "\"${toolbelt}\" force:source:retrieve -m CustomTab,CustomApplication,PermissionSet,CustomLabels,CustomObject -u ${SFDC_USERNAME}"
             if(vk != 0)
             {
                error 'not retrived'
             }
        }
        
        stage('push to dev org')
        {
            
            //rs=bat returnStatus: true, script: "\"${toolbelt}\" force:config:set defaultusername=${SFDC_USERNAME}"
            list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:list"
            //rc = bat returnStatus: true, script: "\"${toolbelt}\" force:source:push --targetusername ${SFDC_USERNAME}"
             rmsg = bat returnStdout: true, script: "\"${toolbelt}\" force:mdapi:deploy -d manifest/. -u ${HUB_ORG}"
            list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:open -u ${SFDC_USERNAME}"
        }
        stage('logging out Orgs')
        {
            removeOrg=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:logout -u ${HUB_ORG} -p"
            removeScratchOrg=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:logout -u ${SFDC_USERNAME} -p"
            list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:list"
        }
    }
}
