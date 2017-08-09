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
            echo 'lol'
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