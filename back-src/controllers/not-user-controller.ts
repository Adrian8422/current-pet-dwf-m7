import { ReportNotUser } from "../models/notUserReport";
import { Report } from "../models/report";
import { User } from "../models/user";

////REPORT NOT USER/// /// NO LOGIN NO SIGNUP

export async function reportNotUser(petReport_id, dataReport) {
  if (!petReport_id) {
    throw "not found petReport_id";
  }
  const reportPetId = await Report.findByPk(petReport_id);
  if (reportPetId) {
    const notUserReport = await ReportNotUser.create({
      ...dataReport,
      petReport_id: reportPetId.get("id"),
    });
    return notUserReport;
  } else {
    throw new Error("not reportIdpet");
  }
}

///ALL REPORTS NOT USER SENT MESSAGE
export async function allReportsSentNotUser() {
  const allReports = await ReportNotUser.findAll();
  return allReports;
}

// / GET ONE USER
export async function getOneUser(user_id) {
  const user = await User.findByPk(user_id);
  return user;
}
