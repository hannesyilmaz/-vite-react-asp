using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;
using webapi.Models;

namespace webapi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private IList<Article> _articles;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            _articles = new List<Article>
            {
                new Article { Title = "Inte klart med ersättare för Ribbenvik", Summary = "▸ Regeringen och SD har ännu inte hittat någon ersättare för Migrationsverkets avgående generaldirektör Mikael Ribbenvik.", Link = "https://www.aftonbladet.se/nyheter/a/8JWWL2/inte-klart-med-ersattare-for-ribbenvik", Published = DateTime.Now.AddDays(-1), Topic = new List<string>{ "SamhalleKonflikter" } },
                new Article { Title = "Drogs in i inhägnad – dödades av 40 krokodiler", Summary = "▸ En 72-årig man har dödats av omkring 40 krokodiler sedan han dragits in i en inhägnad på familjens reptilfarm, enligt…", Link = "https://www.aftonbladet.se/nyheter/a/bgWW6e/drogs-in-i-inhagnad-dodades-av-40-krokodiler", Published = DateTime.Now.AddDays(-2), Topic = new List<string>{ "Ekonomi" } },
                new Article { Title = "Regionpolitiker: Mer stöd från staten behövs", Summary = "▸ Regeringen behöver skjuta till pengar för att välfärden inte ska drabbas drastiskt.", Link = "https://www.aftonbladet.se/nyheter/a/y6XXyR/regionpolitiker-mer-stod-fran-staten-behovs", Published = DateTime.Now.AddDays(-1), Topic = new List<string>{ "Politik" } },
                new Article { Title = "Två avlidna hittade i bostad i Sandviken", Summary = "▸ En man och en kvinna har hittats avlidna i en bostad i Sandviken, skriver polisen på sin hemsida. Dödsorsaken är oklar.", Link = "https://www.aftonbladet.se/nyheter/a/dwPPP1/tva-avlidna-hittade-i-bostad-i-sandviken", Published = DateTime.Now.AddDays(-3), Topic = new List<string>{ "Miljo" } }
            };
        }

        [HttpGet]
        public IActionResult Index(string topic = "", string sortBy = "")
        {
            var articles = _articles;

            if (!string.IsNullOrEmpty(topic))
            {
                articles = articles.Where(a => a.Topic.Contains(topic)).ToList();
            }

            switch (sortBy)
            {
                case "newest":
                    articles = articles.OrderByDescending(a => a.Published).ToList();
                    break;
                case "oldest":
                    articles = articles.OrderBy(a => a.Published).ToList();
                    break;
            }

            return Ok(articles); // Changed from View()
        }

        [HttpGet("Privacy")]
        public IActionResult Privacy()
        {
            return Ok(); // Changed from View()
        }

        [HttpGet("Error")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return Ok(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier }); // Changed from View()
        }
    }
}
