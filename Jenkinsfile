pipeline {
    agent { label 'built-in' }

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        STORE_PATH = "${WORKSPACE}/.pnpm-store"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Node CI') {
            agent {
                docker {
                    image 'white.node-ci:26'
                    reuseNode true
                }
            }

            steps {
                sh '''
                    set -eu

                    echo "=== Runtime ==="
                    node --version
                    pnpm --version

                    echo "=== Workspace ==="
                    pwd
                    test -f package.json
                    test -f pnpm-lock.yaml

                    echo "=== Install ==="
                    pnpm install --frozen-lockfile

                    echo "=== Lint ==="
                    pnpm lint

                    echo "=== Build ==="
                    pnpm build

                    echo "=== Unit Test ==="
                    pnpm test

                    echo "=== E2E Test ==="
                    pnpm test:e2e
                '''
            }
        }
    }

    post {
        success {
            echo 'BFF CI succeeded'
        }

        failure {
            echo 'BFF CI failed'
        }
    }
}