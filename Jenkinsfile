pipeline {
    agent {
        docker {
            image 'node'
            args '-u root'
        }
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm install'
            }
        }
        stage('Test') {
          steps {
            echo 'Yeah... about those tests...'
            echo 'Were gonna have to have you come in on Saturday...'
          }
        }
        stage('Deploy') {
          steps {
            echo 'Taking off...'
            export NODE_ENV=production 
          }
        }
    }
}