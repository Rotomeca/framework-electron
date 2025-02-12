const { RotomecaPromise } = require('../framework/classes/RotomecaPromise');

/**
 * @async
 * @param {string} jsFilePath
 * @returns {RotomecaPromise<void>}
 */
const rjsparser = (jsFilePath) => {
  return new RotomecaPromise((manager, jsFilePath) => {
    manager.resolver.start();
    const fs = require('fs');
    const path = require('path');

    // Lire le fichier JavaScript
    fs.readFile(jsFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Erreur lors de la lecture du fichier JavaScript:', err);
        manager.resolver.reject(err);
        return;
      }

      // Expression régulière pour trouver toutes les lignes d'importation CSS
      const importRegex =
        /import\s+(\w+)\s+from\s+['"](.*\.css)['"]\s+assert\s+\{\s*type:\s*['"]css['"]\s*\};/g;

      // Stocker les modifications
      let newJsContent = data;
      let match;
      const promises = [];

      // Trouver toutes les correspondances
      while ((match = importRegex.exec(data)) !== null) {
        const variableName = match[1]; // Nom de la variable (ex: "sheet", "style", etc.)
        const cssRelativePath = match[2]; // Chemin relatif du fichier CSS
        const cssFilePath = path.join(
          path.dirname(jsFilePath),
          cssRelativePath,
        );

        const promise = new RotomecaPromise(
          async (_, match, variableName, cssFilePath) => {
            try {
              const cssData = await fs.promises.readFile(cssFilePath, 'utf8');
              // Remplacer la ligne d'importation par le code CSS
              newJsContent = newJsContent.replace(
                match[0], // La ligne d'importation complète
                `const ${variableName} = \`${cssData}\`;`, // Nouvelle ligne avec le code CSS
              );
            } catch (err) {
              console.error(
                `Erreur lors de la lecture du fichier CSS ${cssFilePath}:`,
                err,
              );
              manager.resolver.reject(err);
            }
          },
          match,
          variableName,
          cssFilePath,
        );

        promises.push(promise);
      }

      // Attendre que toutes les promesses soient résolues
      Promise.all(promises)
        .then(() => {
          manager.resolver.resolve(newJsContent);
          // // Écrire le fichier JavaScript modifié
          // fs.writeFile(
          //   jsFilePath.replace('.rjs', '.js'),
          //   newJsContent,
          //   'utf8',
          //   (err) => {
          //     if (err) {
          //       console.error(
          //         "Erreur lors de l'écriture du fichier JavaScript:",
          //         err,
          //       );
          //       manager.resolver.reject(err);
          //       return;
          //     }

          //     console.log(
          //       jsFilePath,
          //       'Le fichier JavaScript a été modifié avec succès.',
          //     );
          //     manager.resolver.resolve(true);
          //   },
          // );
        })
        .catch((err) => {
          console.error('Erreur lors du traitement des fichiers CSS:', err);
          manager.resolver.reject(err);
        });
    });
  }, jsFilePath);
};

module.exports = { rjsparser };
