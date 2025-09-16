const {CWebp} = require("cwebp");
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');

const config = JSON.parse(fs.readFileSync('./converter.config.json', 'utf-8'));
const directoryPath = config.directories;
const formatsToMatch = config.formats;
let filesUrl = [];

function getFiles() {
    let promises = directoryPath.map((path) => {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    console.error('Erreur lors de la lecture du dossier :', err);
                    reject(err);
                } else {
                    files.forEach((file) => {
                        const fileExtension = file.split('.').pop().toLowerCase();
                        if(formatsToMatch.includes(fileExtension)) {
                            filesUrl.push(`${path}/${file}`);
                        }
                    });
                    resolve();
                }
            });
        });
    });

    return Promise.all(promises);
}

async function converter() {
    for (const file of filesUrl) {
        await new Promise((resolve, reject) => {
            fs.access(file, fs.constants.F_OK | fs.constants.R_OK, (err) => {
                if (err) {
                    console.error(`Le fichier ${file} n'existe pas ou ne peut être lu.`);
                    reject(err);
                } else {
                    const fileExtension = file.split('.').pop().toLowerCase();
                    const fileName = file.replace('src/assets/imgs', '');

                    if (fileExtension === 'gif') {
                        // Convert GIF to WebM
                        const outputFile = file.replace(`.${fileExtension}`, '.webm');

                        ffmpeg(file)
                            .output(outputFile)
                            .videoCodec('libvpx-vp9')
                            .videoBitrate('1000k')
                            .noAudio()
                            .format('webm')
                            .outputOptions([
                                '-pix_fmt yuva420p',
                                '-an',
                                '-auto-alt-ref 0'
                            ])
                            .on('error', (err) => {
                                console.error(`Erreur lors de la conversion du fichier ${fileName} :`, err);
                                reject(err);
                            })
                            .on('end', () => {
                                console.log(`Le fichier ${fileName} a bien été converti en WebM.`);

                                // Supprimer le fichier original après conversion réussie
                                fs.unlink(file, (unlinkErr) => {
                                    if (unlinkErr) {
                                        console.error(`Erreur lors de la suppression du fichier original ${fileName} :`, unlinkErr);
                                    } else {
                                        console.log(`Fichier original ${fileName} supprimé avec succès.`);
                                    }
                                    resolve();
                                });
                            })
                            .run();
                    } else {
                        // Convert PNG/JPG to WebP
                        const encoder = CWebp(file);
                        const outputFile = file.replace(`.${fileExtension}`, '.webp');

                        encoder.write(outputFile, function (err) {
                            if (err) {
                                console.error(`Erreur lors de la conversion du fichier ${fileName} :`, err);
                                reject(err);
                            } else {
                                console.log(`Le fichier ${fileName} a bien été converti en WebP.`);

                                // Supprimer le fichier original après conversion réussie
                                fs.unlink(file, (unlinkErr) => {
                                    if (unlinkErr) {
                                        console.error(`Erreur lors de la suppression du fichier original ${fileName} :`, unlinkErr);
                                    } else {
                                        console.log(`Fichier original ${fileName} supprimé avec succès.`);
                                    }
                                    resolve();
                                });
                            }
                        });
                    }
                }
            });
        });
    }
}

async function convertFiles() {
    await getFiles();
    await converter();
}

convertFiles();