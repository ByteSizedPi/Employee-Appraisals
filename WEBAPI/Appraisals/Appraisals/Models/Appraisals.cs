using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Appraisals.Models
{
    public class Appraisals
    {
        public string appraisal_id { get; set; }
        public string manager_username { get; set; }
        public string employee_username { get; set; }
        public string template_id { get; set; }
        public string date_created { get; set; }
        public string date_due { get; set; }
        public string manager_score { get; set; }
        public string employee_score { get; set; }
        public string state { get; set; }
    }
}