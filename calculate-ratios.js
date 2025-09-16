const fs = require('fs');
const path = require('path');

const ANIMATED_SPRITES_DIR = './front/src/assets/imgs/animated-sprites';
const POKEMONS_JSON_PATH = './front/src/data/pokemons.json';

// Différentes preview widths utilisées dans l'app
const PREVIEW_WIDTHS = {
  pokemonDetails: 375,    // PokemonDetails.vue
  battleFront: 460,      // BattleZone.vue côté front (adversaire)
  battleBack: 1000       // BattleZone.vue côté back (joueur)
};

function getImageDimensions(imagePath) {
  // Utiliser des commandes système selon la plateforme
  const { execSync } = require('child_process');
  try {
    // macOS: sips
    if (process.platform === 'darwin') {
      try {
        const result = execSync(`sips -g pixelWidth "${imagePath}"`, { encoding: 'utf8' });
        const widthMatch = result.match(/pixelWidth: (\d+)/);
        if (widthMatch) {
          return { width: parseInt(widthMatch[1]) };
        }
      } catch (error) {
        // Continue vers ImageMagick
      }
    }

    // Linux/Windows: ImageMagick identify
    try {
      const result = execSync(`identify -format "%w" "${imagePath}"`, { encoding: 'utf8' });
      return { width: parseInt(result.trim()) };
    } catch (error) {
      console.error(`Erreur avec identify pour ${imagePath}:`, error.message);
    }
  } catch (error) {
    console.error(`Erreur lors du chargement de l'image ${imagePath}:`, error);
  }

  return null;
}

function calculateRatios(width, backWidth = null) {
  return {
    pokemonDetails: (width / PREVIEW_WIDTHS.pokemonDetails) * 100,
    battleFront: (width / PREVIEW_WIDTHS.battleFront) * 100,
    battleBack: ((backWidth || width) / PREVIEW_WIDTHS.battleBack) * 100
  };
}

function extractPokemonNameFromFile(filename) {
  // Retirer l'extension et le suffixe -back s'il existe
  return filename.replace('.gif', '').replace('-back', '');
}

function main() {
  console.log('🚀 Calcul des ratios des animated sprites...');
  console.log(`📱 Plateforme détectée: ${process.platform}`);

  // Lire le fichier pokemons.json
  const pokemonsData = JSON.parse(fs.readFileSync(POKEMONS_JSON_PATH, 'utf8'));

  // Lire le dossier animated-sprites
  const files = fs.readdirSync(ANIMATED_SPRITES_DIR);
  const imageFiles = files.filter(file => file.endsWith('.gif') && !file.includes('-back'));

  console.log(`📁 ${imageFiles.length} images trouvées`);

  // Calculer les ratios pour chaque image
  const ratios = {};

  for (const file of imageFiles) {
    const imagePath = path.join(ANIMATED_SPRITES_DIR, file);
    const pokemonName = extractPokemonNameFromFile(file);

    // Chercher l'image -back correspondante
    const backFile = file.replace('.gif', '-back.gif');
    const backImagePath = path.join(ANIMATED_SPRITES_DIR, backFile);

    const dimensions = getImageDimensions(imagePath);
    let backDimensions = null;

    // Vérifier si le fichier -back existe
    if (fs.existsSync(backImagePath)) {
      backDimensions = getImageDimensions(backImagePath);
    }

    if (dimensions) {
      const backWidth = backDimensions ? backDimensions.width : null;
      const pokemonRatios = calculateRatios(dimensions.width, backWidth);
      ratios[pokemonName] = pokemonRatios;

      console.log(`📊 ${pokemonName}:`);
      console.log(`   - Front: ${dimensions.width}px | Back: ${backWidth || 'N/A'}px`);
      console.log(`   - PokemonDetails: ${pokemonRatios.pokemonDetails.toFixed(2)}%`);
      console.log(`   - BattleFront: ${pokemonRatios.battleFront.toFixed(2)}%`);
      console.log(`   - BattleBack: ${pokemonRatios.battleBack.toFixed(2)}%`);
    }
  }

  // Mettre à jour les données des pokémons
  let updatedCount = 0;
  for (const pokemon of pokemonsData) {
    if (ratios[pokemon.image]) {
      pokemon.ratios = ratios[pokemon.image];
      updatedCount++;
    }
  }

  // Sauvegarder le fichier mis à jour
  fs.writeFileSync(POKEMONS_JSON_PATH, JSON.stringify(pokemonsData, null, 2));

  console.log(`✅ ${updatedCount} pokémons mis à jour avec leurs ratios`);
  console.log(`💾 Fichier ${POKEMONS_JSON_PATH} sauvegardé`);
}

main();