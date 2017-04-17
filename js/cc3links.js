var app = angular.module('app', []);

app.constant('urls', {
  local: {
    vente: 'http://localhost:7003/ventePanier/{idClient}/bureauRdv/{bureauRdv}',
    compte: 'http://localhost:7005/personnalisationCompte/{idClients}/proposition/{idProposition}/situationMetier/{situationMetier}/bureauRdv/{bureauRdv}',
    carte: 'http://localhost:7005/personnalisationCarte/{idClient}/proposition/{idProposition}/situationMetier/{situationMetier}/bureauRdv/{bureauRdv}',
    recap: 'http://localhost:7005/propositionContrat/{idClients}/situationMetier/{situationMetier}/bureauRdv/{bureauRdv}/{?idPropositionCompte,idPropositionsCarte}'
  },
  tass: {
    simple: 'http://google.fr/test',
    double: 'http://google.fr'
  },
  tfo: {
    simple: 'http://google.fr/test',
    double: 'http://google.fr'
  },
  tpb: {
    simple: 'http://google.fr/test',
    double: 'http://google.fr'
  },
  b9_: {
    imoe: {
      simple: 'http://google.fr/test',
      double: 'http://google.fr'
    },
    rmoa: {
      simple: 'http://google.fr/test',
      double: 'http://google.fr'
    }
  }
});

app.service('champsService', function() {

  this.formatterIdClient = function(id) {
    if (id !== undefined && id !== null && id !== '' && new RegExp(/^\d*$/).test(id)) {
      var nb = 9 - id.length;

      id = "0".repeat(nb) + id;
    }

    return id;
  };

});

app.service('urlsService', function() {

  /**
   * Ouverture d'une nouvelle page
   */
  this.open = function(url, params) {
    window.open(formatterUrl(url, params));
  };

  /**
   * Transformation de l'url avec les paths Variables
   * 
   * @param {*} url 
   * @param {*} params 
   */
  var formatterUrl = function(url, params) {
    var retour = url;
    var value = null;

    if (typeof url === 'string' && typeof params === 'object') {
      for (var param in params) {
        value = params[param];
        if (Array.isArray(value)) {
          value = value.join(',');
        }
        retour = retour.replace('{' + param + '}', value);
      }

      retour = addQueries(retour, params);
    }

    return retour;
  };

  /**
   * Ajout des queries à l'URL
   * 
   * @param {*} url 
   * @param {*} params 
   */
  var addQueries = function(url, params) {
    var retour = url;

    // Récupération des queries
    var startQueries = url.indexOf('{?');
    var endQueries = url.indexOf('}');

    if (startQueries > 0 && endQueries > 0) {

      // Transformation des queries en tableau
      var queries = retour.substring(startQueries + 2, endQueries).split(',');

      // Suppression des queries dans l'url
      retour = retour.substring(0, startQueries);

      var value = null;
      var indice = 0;

      // Parcours des queries
      for (var i in queries) {

        // Récupération de la value
        value = params[queries[i]];

        // Transformation en chaine
        if (Array.isArray(value)) {
          value = value.join(',');
        }

        // Ajout des queries à l'url
        if (value) {
          if (indice > 0) {
            retour += '&';
          }
          retour += queries[i] + '=' + value;
          indice++;
        }
      }
    }

    return retour;
  }
});

app.controller('menuController', function($scope, urls) {
  $scope.urls = urls;
});

app.controller('ventePanierController', function($scope, urls, champsService, urlsService) {

  $scope.form = {
    idClient: '',
    bureauRdv: '385530'
  };

  $scope.valider = function() {
    $scope.form.idClient = champsService.formatterIdClient($scope.form.idClient);

    urlsService.open(urls.local.vente, $scope.form);
  };
});

app.controller('compteController', function($scope, urls, champsService, urlsService) {

  $scope.form = {
    idClients: [''],
    idProposition: '',
    situationMetier: 'VENTE',
    bureauRdv: '385530'
  };

  $scope.ajouterClient = function() {
    $scope.form.idClients.push('');
  };

  $scope.supprimerClient = function(index) {
    $scope.form.idClients.splice(index, 1);
  };

  $scope.valider = function() {
    for (var i in $scope.form.idClients) {
      $scope.form.idClients[i] = champsService.formatterIdClient($scope.form.idClients[i]);
      
    }
    urlsService.open(urls.local.compte, $scope.form);
  };
});

app.controller('carteController', function($scope, urls, champsService, urlsService) {

  $scope.form = {
    idClients: [''],
    idProposition: '',
    situationMetier: 'VENTE',
    bureauRdv: '385530'
  };

  $scope.valider = function() {
    $scope.form.idClient = champsService.formatterIdClient($scope.form.idClient);

    urlsService.open(urls.local.carte, $scope.form);
  };
});

app.controller('recapController', function($scope, urls, champsService, urlsService) {

  $scope.form = {
    idClients: [''],
    idPropositionCompte: '',
    idPropositionsCarte: [''],
    situationMetier: 'VENTE',
    bureauRdv: '385530'
  };

  $scope.ajouterClient = function() {
    $scope.form.idClients.push('');
  };

  $scope.supprimerClient = function(index) {
    $scope.form.idClients.splice(index, 1);
  };

  $scope.ajouterCarte = function() {
    $scope.form.idPropositionsCarte.push('');
  };

  $scope.supprimerCarte = function(index) {
    $scope.form.idPropositionsCarte.splice(index, 1);
  };

  $scope.valider = function() {
    for (var i in $scope.form.idClients) {
      $scope.form.idClients[i] = champsService.formatterIdClient($scope.form.idClients[i]);
      
    }
    urlsService.open(urls.local.recap, $scope.form);
  };

});

app.directive('idClient', function(champsService) {
  return {
    link: function(scope, element, attrs, ngModelCtrl) {
      element.on('blur', function(e) {
        this.value = champsService.formatterIdClient(this.value);
      });
    }
  };
});