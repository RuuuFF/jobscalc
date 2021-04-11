const Profile = require('../model/Profile')

module.exports = {
  index(req, res) {
    return res.render("profile", { profile: Profile.get() })
  },

  update(req, res) {
    // req.body para pegar os dados
    const data = req.body

    // Definir quantas semanas tem um ano: 52
    const weeksPerYear = 52

    // Remover as semanas de férias do ano
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

    // Quantas horas por semana estou trabalhando (horas trabalhando * dias na semana)
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"] 

    // Total de horas trabalhadas no mês
    const monthlyTotalHours = weekTotalHours * weeksPerMonth

    // Valor da minha hora
    const valueHour = data["monthly-budget"] / monthlyTotalHours

    Profile.update({
      ...Profile.get(),
      ...req.body,
      "value-hour": valueHour,
    })

    return res.redirect('/profile')
  },
}