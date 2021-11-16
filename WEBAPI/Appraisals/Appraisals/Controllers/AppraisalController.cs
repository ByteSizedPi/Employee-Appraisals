using Appraisals.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Appraisals.Controllers
{
    [Authorize]
    public class AppraisalController : ApiController
    {
        [HttpGet]
        [Route("api/appraisals/manager")]
        public HttpResponseMessage GetByManager(string username)
        {
            string query = @"SELECT dbo.Users.name, dbo.Appraisals.* FROM dbo.Users
                            INNER JOIN dbo.Appraisals ON dbo.Appraisals.employee_username = dbo.Users.username
                            WHERE manager_username = '" + username + @"'";
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Route("api/appraisals/employee")]
        public HttpResponseMessage GetByEmployee(string username)
        {
            string query = @"SELECT *
                        FROM dbo.Appraisals
                        WHERE employee_username='" + username + @"'";
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        public string Post(Appraisals.Models.Appraisals appraisal)
        {
            try
            {
                string query = @"
                insert into dbo.Appraisals values
                ('" + appraisal.manager_username + @"', '" +
                appraisal.employee_username + @"', '" +
                appraisal.template_id + @"', '" +
                appraisal.date_created + @"', '" +
                appraisal.date_due + @"', '" +
                appraisal.manager_score + @"', '" +
                appraisal.employee_score + @"', '" +
                appraisal.state + @"')";

                DataTable table = this.executeQuery(query);

                return "Added Appraisal Successfully";
            }
            catch (Exception)
            {
                return "Failed to Add Appraisal";
            }
        }

        [HttpPut]
        [Route("api/appraisals/complete")]
        public string Complete(string scores, int id)
        {
            string query = @"
                        UPDATE dbo.Appraisals
                        SET ""state"" = 'completed',
                        employee_score='" + scores + @"'
                        where appraisal_id='" + id + @"'";
            try
            {
                DataTable table = this.executeQuery(query);
                return "Updated Appraisal Successfully";
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        [HttpPut]
        [Route("api/appraisals/cancel")]
        public string Cancel(int id)
        {
            string query = @"
                        UPDATE dbo.Appraisals
                        SET ""state"" = 'cancelled'
                        WHERE appraisal_id='" + id + @"'";
            try
            {
                DataTable table = this.executeQuery(query);
                return "Updated Appraisal Successfully";
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        private DataTable executeQuery(string query)
        {
            DataTable table = new DataTable();
            using (var con = new SqlConnection(ConfigurationManager.
                ConnectionStrings["dbEmployeeAppraisals"].ConnectionString))
            using (var cmd = new SqlCommand(query, con))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.Text;
                da.Fill(table);
            }
            return table;
        }
    }
}
