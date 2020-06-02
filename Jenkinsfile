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
      steps {
        script {
          sh 'docker build -t $registry:$GIT_COMMIT .'
          docker.withRegistry( '', registryCredential ) {
            sh 'docker push $registry:$GIT_COMMIT'
            sh 'docker rmi $registry:$GIT_COMMIT'
          }
        }
      }
    }
    stage('Building and Push Image Release') {
      when {
        expression {
          env.TAG_NAME != null
        }
      }
      steps {
        script {
          sh 'docker build -t $registry:$TAG_NAME .'
          docker.withRegistry( '', registryCredential ) {
            sh 'docker push $registry:$TAG_NAME'
            sh 'docker rmi $registry:$TAG_NAME'
          }
            sh """
                  curl -D - -X \"POST\" \
                    -H \"content-type: application/json\" \
                    -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                    -d '{\"argString\": \"-namespace $namespace_prod -commit $TAG_NAME -image $registry:$TAG_NAME -deployment $deployment\"}' \
                    https://fox.linea.gov.br/api/1/job/9c5ca707-30b5-4048-9ebe-600d12d3de5e/executions
             """
        }
      }
    }
  }
}
