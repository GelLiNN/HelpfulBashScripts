import com.google.code.chatterbotapi.ChatterBot;
import com.google.code.chatterbotapi.ChatterBotFactory;
import com.google.code.chatterbotapi.ChatterBotSession;
import com.google.code.chatterbotapi.ChatterBotType;

/**
 * Created by MasterOfTheUniverse on 5/31/16.
 */
public class Program {

    public static void main(String[] args) throws Exception {
        ChatterBotFactory factory = new ChatterBotFactory();

        ChatterBot bot1 = factory.create(ChatterBotType.CLEVERBOT);
        ChatterBotSession bot1session = bot1.createSession();

        // starting bot id: b0dafd24ee35a477 for Chomsky
        ChatterBot bot2 = factory.create(ChatterBotType.PANDORABOTS, "b0dafd24ee35a477");
        ChatterBotSession bot2session = bot2.createSession();

        String s = "Hi";
        while (true) {

            System.out.println("Chomsky > " + s);

            s = bot2session.think(s);

            Thread.sleep(2000);

            System.out.println("Chomsky > " + s);

            s = bot1session.think(s);

            Thread.sleep(2000);
        }
    }
}
