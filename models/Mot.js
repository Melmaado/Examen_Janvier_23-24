import Model from './Model.js';

export default class Mot extends Model {

    static table = "examen.vocabulaire";
    static primary = ["id_mot"];
}
