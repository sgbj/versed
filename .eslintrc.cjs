module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'mocha': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'semi': ['error', 'always'],
        'quotes': ['warn', 'single'],
        'eqeqeq':  ['warn', 'always'],
        'indent': ['warn', 4],
        'no-multiple-empty-lines': ['warn', {'max': 2, 'maxEOF': 1}],
        'no-trailing-spaces': ['error', {'ignoreComments': true}],
        'eol-last': ['error', 'always']
    },
};
