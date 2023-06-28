<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
class logincontroller extends Controller
{
    public function getAllCountries()
    {
        try {
            $countries = DB::select('SELECT * FROM countries');
            return response()->json($countries);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    public function getAllRegions()
    {
        try {
            $regions = DB::select('SELECT * FROM states');
            return response()->json($regions);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    public function saveFormData(Request $request)
    {
        // Validate the form data
        $validatedData = $request->validate([
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email',
            'country' => 'required|integer',
            'region' => 'required|integer',
        ]);
        // Prepare the SQL query to insert the form data
        $sql = "INSERT INTO userdatas (firstname, lastname, email, country_id, state_id, created_at, updated_at)
        VALUES (:first_name, :last_name, :email, :country_id, :state_id, NOW(), NOW())";
        // Execute the SQL query with the form data
        try {
            DB::insert($sql, [
                'first_name' => $validatedData['firstName'],
                'last_name' => $validatedData['lastName'],
                'email' => $validatedData['email'],
                'country_id' => $validatedData['country'],
                'state_id' => $validatedData['region'],
            ]);
            // Create the Email object and configure it
            $email = (new Email())
                ->from('abhiravi889833@gmail.com')
                ->to('grp.abhiram@gmail.com')
                ->subject('Hello')
                ->text('Your account created.')
                ->html('<h1>Click here to update password</h1>');
            // Create the SMTP transport
            $transport = Transport::fromDsn('smtp://abhiravi889833@gmail.com:gcsmypoquyicuqst@smtp.gmail.com:587');
            // Create the Mailer instance and send the email
            $mailer = new Mailer($transport);
            $mailer->send($email);
            // Email sent successfully
            return response()->json(['message' => 'Form data saved successfully and email sent'], 200);
        } catch (TransportExceptionInterface $e) {
            // Failed to send email
            return response()->json(['error' => 'An error occurred while sending the email: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while saving the form data: ' . $e->getMessage()], 500);
        }
    }
}