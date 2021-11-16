using Appraisals.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Appraisals.Controllers
{
    [Authorize]
    public class TemplateController : ApiController
    {

        public HttpResponseMessage Get()
        {
            string query = @"SELECT * FROM dbo.Templates";
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        public HttpResponseMessage Get(string id)
        {
            string query = @"SELECT * FROM dbo.Templates WHERE template_id=" + id;
            DataTable table = this.executeQuery(query);
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        public string Post(Templates template)
        {
            string query = @"
                INSERT INTO dbo.Templates VALUES
                ('" + template.template_name + @"', '" +
                template.date_created + @"', '" +
                template.state + @"', '" +
                template.template_object + @"')";
            try
            {
                DataTable table = this.executeQuery(query);
                return "Added Template Successfully";
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
