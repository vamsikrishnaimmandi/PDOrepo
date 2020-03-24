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
def PDO_USER=env.PDO_USER
def CLIENT_ID=env.CLIENT_ID

println 'KEY IS' 
println JWT_KEY_CRED_ID
println HUB_ORG
println SFDC_HOST
println CONNECTED_APP_CONSUMER_KEY
println CLIENT_ID
println PDO_USER
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

            // removeOrg=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:logout -u ${HUB_ORG} -p"
             rc = bat returnStatus: true, script: "\"${toolbelt}\" force:auth:jwt:grant --clientid ${CLIENT_ID} --username ${PDO_USER} --jwtkeyfile \"${jwt_key_file}\"  --instanceurl ${SFDC_HOST}"
             rc1 = bat returnStatus: true, script: "\"${toolbelt}\" force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile \"${jwt_key_file}\" --setdefaultdevhubusername --instanceurl ${SFDC_HOST}"
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
           // rmsg = bat returnStatus: true, script: "\"${toolbelt}\" force:org:create --definitionfile config/project-scratch-def.json -v ${HUB_ORG} username=${SFDC_USERNAME}"       
        }
        stage('Create a Password for Scratch Org')
        {
                rs=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --jwtkeyfile \"${jwt_key_file}\" --username ${SFDC_USERNAME} --instanceurl https://test.salesforce.com --setdefaultusername"
                rc=bat returnStatus: true, script: "\"${toolbelt}\" force:user:password:generate --targetusername ${SFDC_USERNAME}"
                rS=bat returnStatus: true, script: "\"${toolbelt}\" force:user:display --targetusername ${SFDC_USERNAME}"
<<<<<<< HEAD
                if (rc != 0)
=======
              if (rc != 0)
>>>>>>> 604734334930467f8b82fe06ed802a4dc786777e
            {
              error 'Password Not Created' 
            }

        }
        stage('Retrive Data from scratch Org')
        {
             vk=bat returnStatus: true, script: "\"${toolbelt}\" force:source:retrieve -x manifest/package.xml -u ${SFDC_USERNAME}"
             if(vk != 0)
             {
                error 'not retrived'
             }
        }
        
        stage('push to dev org')
        {
            
             rmsg = bat returnStatus: true, script: "\"${toolbelt}\" force:source:deploy -x manifest/package.xml -u ${PDO_USER}"
<<<<<<< HEAD
                         list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:open -u ${SFDC_USERNAME}"
              if (rmsg != 0)
=======
            list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:open -u ${SFDC_USERNAME}"
             if (rmsg != 0)
>>>>>>> 604734334930467f8b82fe06ed802a4dc786777e
            {
              error 'Deployment Failed' 
            }
        }
        stage('logging out Orgs')
        {
            removeOrg=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:logout -u ${HUB_ORG} -p"
            removePdo=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:logout -u ${PDO_USER} -p"
            removeScratchOrg=bat returnStatus: true, script: "\"${toolbelt}\" force:auth:logout -u ${SFDC_USERNAME} -p"
            list= bat returnStatus: true, script: "\"${toolbelt}\" force:org:list"
        }
    }
}
