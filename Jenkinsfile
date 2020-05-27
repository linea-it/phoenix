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
        }
      }
    }
  }
}
