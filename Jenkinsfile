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
        stage('Kickoff') {
          echo 'Kicking it off...'
          export NODE_ENV=production 
        }
    }
}