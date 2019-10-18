const Company = require('./../model/company.js');
const mongoose = require('mongoose');

const validCompanyData = {
    name: "test",
    phone: "test phone",
    email: "test email",
    logoUrl: "test logo"
};

beforeAll(async () => {
    const url = `mongodb+srv://matchme:S1eDmHKdzWnGLR02@matchmemongo-f5qtv.mongodb.net/testmatchmedb?retryWrites=true&w=majority`;
    await mongoose.connect(url, { useNewUrlParser: true })
});


it('Should save company to database', async done => {
    const company = new Company(validCompanyData);

    const savedCompany = await company.save();

    expect(savedCompany.name).toBe(validCompanyData.name);
    expect(savedCompany.phone).toBe(validCompanyData.phone);
    expect(savedCompany.email).toBe(validCompanyData.email);
    expect(savedCompany.logoUrl).toBe(validCompanyData.logoUrl);


    done();
});

afterAll(async () => {
    await Company.deleteMany();
    await mongoose.connection.close();
});


