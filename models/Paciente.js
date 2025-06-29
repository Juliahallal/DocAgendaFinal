const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongooseDelete = require("mongoose-delete");

const exameSchema = new Schema({
  tipo: String,
  anexoId: String,
  resultado: String,
  observacoes: String
});

const pacienteSchema = new Schema({
    nome: { type: String, required: true },
    nomeMae: String,
    dataNasc: Date,
    sexo: String,
    fone: String,
    endereco: String,
    documento:String,
    plano:String,
    alergias:String,
    vacinas: String,
    historicoFamilia: String,
    internacoes: String,
    prontuario: String, 
    remedio: String,
    comorbidade: String,
    exame: [exameSchema],
    userId: mongoose.ObjectId,
    userName: String,
  },{
    timestamps: true,
  }
);

pacienteSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
const Paciente = mongoose.model("Paciente", pacienteSchema);

module.exports = Paciente;