pipeline {
  environment {
    registry = 'linea/phoenix'
    registryCredential = 'Dockerhub'
    dockerImage = ''
    GIT_COMMIT_SHORT = sh(
      script: "printf \$(git rev-parse --short ${GIT_COMMIT})",
      returnStdout: true
    )
  }
  agent any
  stages {
    stage('Creating version.json') {
      steps {
        sh './version.sh && cat ./src/assets/json/version.json'
      }
    }
    stage('Build Images') {
      steps {
        script {
          dockerImage = docker.build registry + ":$GIT_COMMIT_SHORT"
        }
      }
    }
    stage('Push Images') {
      steps {
        script {
          docker.withRegistry('', registryCredential) {
            dockerImage.push()
          }
        }
      }
    }
  }
  post {
    always {
      sh "docker rmi $registry:$GIT_COMMIT_SHORT --force"
      sh "docker rmi $registryBackend:$GIT_COMMIT_SHORT --force"
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
