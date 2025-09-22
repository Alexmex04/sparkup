// backend/config/adminSeeder.js
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/UserModel.js";

export async function createAdminUser() {
  const adminEmail = process.env.ADMIN_NAME;
  const adminPassword = process.env.ADMIN_PASS;
  const firstName = process.env.ADMIN_FN || "Admin";
  const lastName  = process.env.ADMIN_LN || "Root";

  if (!adminEmail || !adminPassword) {
    console.log("[seed] ADMIN_NAME/ADMIN_PASS no definidos; se omite usuario de prueba.");
    return;
  }

  const existing = await User.findOne({ where: { email: adminEmail } });
  if (existing) {
    console.log(`[seed] Usuario de prueba ya existe: ${adminEmail}`);
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  await User.create({
    firstName,
    lastName,
    email: adminEmail,
    password: hashed,
    role: "admin",         
    status: true,
    emailToken: uuidv4(), // este campo SÍ existe en tu modelo
  });

  console.log(`[seed] Usuario de prueba creado: ${adminEmail} (role=admin)`);
}
