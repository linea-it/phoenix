pipeline {
  environment {
    registry = "linea/phoenix"
    registryCredential = 'Dockerhub'
    dockerImage = ''
    deployment = 'phoenix'
    namespace = 'phoenix'
    namespace_prod = 'phoenix'
    commit = ''
  }
  agent any
  stages {
    stage('Creating version.json') {
      steps {
        sh './version.sh && cat ./src/assets/json/version.json'
      }
    }
      stage('Building and push image') {
        when {
          allOf {
            expression {
              env.TAG_NAME == null
            }
            expression {
              env.BRANCH_NAME.toString().equals('master')
            }
          }
        }
      steps {
        script {
          sh 'docker build -t $registry:$GIT_COMMIT .'
          docker.withRegistry( '', registryCredential ) {
            sh 'docker push $registry:$GIT_COMMIT'
            sh 'docker rmi $registry:$GIT_COMMIT'
          }
        sh """
                curl -D - -X \"POST\" \
                -H \"content-type: application/json\" \
                -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                -d '{\"argString\": \"-namespace $namespace -commit $GIT_COMMIT -image $registry:$GIT_COMMIT -deployment $deployment\"}' \
                https://fox.linea.gov.br/api/1/job/9c5ca707-30b5-4048-9ebe-600d12d3de5e/executions
            """
        }
      }
    }
  }
}
