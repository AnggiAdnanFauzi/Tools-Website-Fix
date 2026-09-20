<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Requisition;
use App\Models\Job;
use App\Models\Candidate;
use App\Models\Application;
use App\Models\Interview;
use App\Models\Task;
use App\Models\Stage;
use App\Models\Interviewer;

class ClientAdminDataSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure stages & interviewers exist
        $stages = [
            ['id' => 'applied', 'name' => 'Applied', 'color' => '#64748b', 'order' => 1],
            ['id' => 'screening', 'name' => 'Screening', 'color' => '#3b82f6', 'order' => 2],
            ['id' => 'assessment', 'name' => 'Assessment', 'color' => '#8b5cf6', 'order' => 3],
            ['id' => 'interview', 'name' => 'Interview', 'color' => '#eab308', 'order' => 4],
            ['id' => 'offer', 'name' => 'Offer', 'color' => '#f97316', 'order' => 5],
            ['id' => 'hired', 'name' => 'Hired', 'color' => '#22c55e', 'order' => 6],
        ];
        foreach ($stages as $s) {
            Stage::updateOrCreate(['id' => $s['id']], $s);
        }

        $interviewers = [
            ['id' => 'int01', 'name' => 'Alex Greene', 'role' => 'Hiring Manager'],
            ['id' => 'int02', 'name' => 'Brenda Smith', 'role' => 'Senior Engineer'],
            ['id' => 'int03', 'name' => 'Charles Brown', 'role' => 'Lead Engineer'],
            ['id' => 'int04', 'name' => 'Diana Prince', 'role' => 'HR Specialist'],
            ['id' => 'int05', 'name' => 'Edward King', 'role' => 'Product Manager'],
            ['id' => 'int06', 'name' => 'Fiona Glenanne', 'role' => 'Recruiter'],
        ];
        foreach ($interviewers as $i) {
            Interviewer::updateOrCreate(['id' => $i['id']], $i);
        }

        // ============================================================
        // CLIENT ADMIN: user-02 (Hana Kusuma - TechCorp Solutions)
        // ============================================================
        $companyId = 'user-02';

        // Projects
        Project::updateOrCreate(['id' => 'proj-tc01'], [
            'id' => 'proj-tc01',
            'name' => 'TechCorp Backend Revamp',
            'description' => 'Modernisasi arsitektur backend TechCorp ke microservices.',
            'status' => 'Active',
            'owner_id' => 'int01',
            'company_id' => $companyId,
            'created_date' => '2026-07-01T10:00:00Z',
        ]);
        Project::updateOrCreate(['id' => 'proj-tc02'], [
            'id' => 'proj-tc02',
            'name' => 'TechCorp Mobile App Team',
            'description' => 'Membentuk tim mobile app untuk produk baru TechCorp.',
            'status' => 'Active',
            'owner_id' => 'int05',
            'company_id' => $companyId,
            'created_date' => '2026-08-01T09:00:00Z',
        ]);

        // Requisitions
        Requisition::updateOrCreate(['id' => 'req-tc01'], [
            'id' => 'req-tc01',
            'title' => 'Senior Laravel Developer',
            'department' => 'Engineering',
            'location' => 'Jakarta, Indonesia',
            'employment_type' => 'Full-time',
            'headcount' => 2,
            'experience_level' => 'Senior',
            'salary_min' => 15000000,
            'salary_max' => 25000000,
            'deadline' => '2026-10-30',
            'status' => 'Approved',
            'job_id' => 'job-tc01',
            'company_id' => $companyId,
        ]);
        Requisition::updateOrCreate(['id' => 'req-tc02'], [
            'id' => 'req-tc02',
            'title' => 'React Native Developer',
            'department' => 'Mobile',
            'location' => 'Remote',
            'employment_type' => 'Full-time',
            'headcount' => 1,
            'experience_level' => 'Mid-level',
            'salary_min' => 12000000,
            'salary_max' => 18000000,
            'deadline' => '2026-11-15',
            'status' => 'Approved',
            'job_id' => 'job-tc02',
            'company_id' => $companyId,
        ]);
        Requisition::updateOrCreate(['id' => 'req-tc03'], [
            'id' => 'req-tc03',
            'title' => 'QA Automation Engineer',
            'department' => 'Quality Assurance',
            'location' => 'Jakarta (Hybrid)',
            'employment_type' => 'Full-time',
            'headcount' => 1,
            'experience_level' => 'Mid-level',
            'salary_min' => 10000000,
            'salary_max' => 16000000,
            'deadline' => '2026-10-20',
            'status' => 'Pending',
            'company_id' => $companyId,
        ]);

        // Jobs
        Job::updateOrCreate(['id' => 'job-tc01'], [
            'id' => 'job-tc01',
            'title' => 'Senior Laravel Developer',
            'department' => 'Engineering',
            'level' => 'Senior',
            'location' => 'Jakarta, Indonesia',
            'status' => 'Open',
            'employment_type' => 'Full-time',
            'total_applicants' => 3,
            'days_open' => 14,
            'salary_min' => 15000000,
            'salary_max' => 25000000,
            'deadline' => '2026-10-30',
            'project_id' => 'proj-tc01',
            'company_id' => $companyId,
            'job_description' => 'Kami mencari Senior Laravel Developer berpengalaman untuk membangun arsitektur microservices. Bertanggung jawab atas desain API, optimasi database, dan mentoring junior developer.',
            'competencies' => ['Laravel', 'PHP', 'MySQL', 'Redis', 'Docker', 'REST API', 'Unit Testing'],
        ]);
        Job::updateOrCreate(['id' => 'job-tc02'], [
            'id' => 'job-tc02',
            'title' => 'React Native Developer',
            'department' => 'Mobile',
            'level' => 'Mid-level',
            'location' => 'Remote',
            'status' => 'Open',
            'employment_type' => 'Full-time',
            'total_applicants' => 2,
            'days_open' => 7,
            'salary_min' => 12000000,
            'salary_max' => 18000000,
            'deadline' => '2026-11-15',
            'project_id' => 'proj-tc02',
            'company_id' => $companyId,
            'job_description' => 'Bergabung dengan tim mobile kami untuk membangun aplikasi cross-platform menggunakan React Native. Pengalaman dengan TypeScript dan state management diutamakan.',
            'competencies' => ['React Native', 'TypeScript', 'Redux', 'REST API', 'Git'],
        ]);

        // Candidates (shared pool, no company_id needed on candidates)
        Candidate::updateOrCreate(['id' => 'cand-tc01'], [
            'id' => 'cand-tc01', 'name' => 'Adi Nugraha',
            'avatar_url' => 'https://picsum.photos/seed/adi/100',
            'email' => 'adi.nugraha@example.com', 'phone' => '+6281200001111',
            'experience_years' => 6, 'expected_salary' => 22000000,
            'skills' => 'Laravel, PHP, MySQL, Redis, Docker, CI/CD',
            'major' => 'Teknik Informatika', 'strengths' => 'Berpengalaman di microservices dan high-traffic systems.',
        ]);
        Candidate::updateOrCreate(['id' => 'cand-tc02'], [
            'id' => 'cand-tc02', 'name' => 'Sari Wijaya',
            'avatar_url' => 'https://picsum.photos/seed/sari/100',
            'email' => 'sari.wijaya@example.com', 'phone' => '+6281200002222',
            'experience_years' => 4, 'expected_salary' => 18000000,
            'skills' => 'Laravel, Vue.js, PostgreSQL, TDD',
            'major' => 'Sistem Informasi', 'strengths' => 'Detail-oriented dan test-driven.',
        ]);
        Candidate::updateOrCreate(['id' => 'cand-tc03'], [
            'id' => 'cand-tc03', 'name' => 'Reza Pratama',
            'avatar_url' => 'https://picsum.photos/seed/reza/100',
            'email' => 'reza.p@example.com', 'phone' => '+6281200003333',
            'experience_years' => 3, 'expected_salary' => 15000000,
            'skills' => 'React Native, TypeScript, Redux, Firebase',
            'major' => 'Ilmu Komputer', 'strengths' => 'Cepat belajar, pengalaman publish 2 app ke PlayStore.',
        ]);
        Candidate::updateOrCreate(['id' => 'cand-tc04'], [
            'id' => 'cand-tc04', 'name' => 'Dina Puspita',
            'avatar_url' => 'https://picsum.photos/seed/dina/100',
            'email' => 'dina.puspita@example.com', 'phone' => '+6281200004444',
            'experience_years' => 5, 'expected_salary' => 16000000,
            'skills' => 'React Native, Flutter, Kotlin, Swift',
            'major' => 'Teknik Komputer',
        ]);
        Candidate::updateOrCreate(['id' => 'cand-tc05'], [
            'id' => 'cand-tc05', 'name' => 'Bayu Aditya',
            'avatar_url' => 'https://picsum.photos/seed/bayu/100',
            'email' => 'bayu.aditya@example.com', 'phone' => '+6281200005555',
            'experience_years' => 7, 'expected_salary' => 24000000,
            'skills' => 'PHP, Laravel, Go, Kubernetes, AWS',
            'major' => 'Teknik Informatika', 'strengths' => 'Arsitektur cloud-native expert.',
        ]);

        // Applications
        Application::updateOrCreate(['id' => 'app-tc01'], [
            'id' => 'app-tc01', 'candidate_id' => 'cand-tc01', 'job_id' => 'job-tc01',
            'company_id' => $companyId, 'stage_id' => 'interview',
            'applied_date' => '2026-08-20T09:00:00Z', 'source' => 'LinkedIn', 'total_score' => 88,
            'scorecard' => [['name'=>'Experience','weight'=>0.4,'score'=>90],['name'=>'Technical','weight'=>0.4,'score'=>85],['name'=>'Culture Fit','weight'=>0.2,'score'=>90]],
            'notes' => [['author'=>'Diana Prince','content'=>'Strong Laravel experience. Proceeding to technical interview.','date'=>'2026-08-21T10:00:00Z']],
        ]);
        Application::updateOrCreate(['id' => 'app-tc02'], [
            'id' => 'app-tc02', 'candidate_id' => 'cand-tc02', 'job_id' => 'job-tc01',
            'company_id' => $companyId, 'stage_id' => 'assessment',
            'applied_date' => '2026-08-22T11:00:00Z', 'source' => 'Career Site', 'total_score' => 82,
            'scorecard' => [['name'=>'Experience','weight'=>0.4,'score'=>80],['name'=>'Technical','weight'=>0.4,'score'=>85],['name'=>'Culture Fit','weight'=>0.2,'score'=>80]],
        ]);
        Application::updateOrCreate(['id' => 'app-tc03'], [
            'id' => 'app-tc03', 'candidate_id' => 'cand-tc05', 'job_id' => 'job-tc01',
            'company_id' => $companyId, 'stage_id' => 'offer',
            'applied_date' => '2026-08-18T08:00:00Z', 'source' => 'Referral', 'total_score' => 95,
            'scorecard' => [['name'=>'Experience','weight'=>0.4,'score'=>98],['name'=>'Technical','weight'=>0.4,'score'=>95],['name'=>'Culture Fit','weight'=>0.2,'score'=>88]],
            'notes' => [['author'=>'Alex Greene','content'=>'Outstanding backend architect. Making an offer.','date'=>'2026-08-28T16:00:00Z']],
        ]);
        Application::updateOrCreate(['id' => 'app-tc04'], [
            'id' => 'app-tc04', 'candidate_id' => 'cand-tc03', 'job_id' => 'job-tc02',
            'company_id' => $companyId, 'stage_id' => 'screening',
            'applied_date' => '2026-09-01T10:00:00Z', 'source' => 'Indeed', 'total_score' => 78,
        ]);
        Application::updateOrCreate(['id' => 'app-tc05'], [
            'id' => 'app-tc05', 'candidate_id' => 'cand-tc04', 'job_id' => 'job-tc02',
            'company_id' => $companyId, 'stage_id' => 'interview',
            'applied_date' => '2026-08-28T14:00:00Z', 'source' => 'LinkedIn', 'total_score' => 85,
        ]);

        // Interviews
        Interview::updateOrCreate(['id' => 'iv-tc01'], [
            'id' => 'iv-tc01', 'application_id' => 'app-tc01', 'type' => 'Technical Interview',
            'date_time' => '2026-09-05T14:00:00Z',
            'interviewers' => [['id'=>'int02','name'=>'Brenda Smith','role'=>'Senior Engineer']],
            'location_or_link' => 'https://meet.google.com/tc-int-01',
            'status' => 'Completed', 'recommendation' => 'Hire',
            'scorecard' => [['competency'=>'Laravel','rating'=>4,'notes'=>'Deep framework knowledge.'],['competency'=>'System Design','rating'=>4,'notes'=>'Good approach to microservices.']],
        ]);
        Interview::updateOrCreate(['id' => 'iv-tc02'], [
            'id' => 'iv-tc02', 'application_id' => 'app-tc05', 'type' => 'Screen',
            'date_time' => '2026-09-08T10:00:00Z',
            'interviewers' => [['id'=>'int04','name'=>'Diana Prince','role'=>'HR Specialist']],
            'location_or_link' => 'Phone Call', 'status' => 'Scheduled',
        ]);

        // Tasks
        Task::updateOrCreate(['id' => 'task-tc01'], [
            'id' => 'task-tc01', 'application_id' => 'app-tc01',
            'title' => 'Review hasil assessment teknis Adi', 'due_date' => '2026-09-10',
            'assignee_id' => 'int01', 'status' => 'To Do',
        ]);
        Task::updateOrCreate(['id' => 'task-tc02'], [
            'id' => 'task-tc02', 'application_id' => 'app-tc03',
            'title' => 'Siapkan offer letter untuk Bayu', 'due_date' => '2026-09-05',
            'assignee_id' => 'int04', 'status' => 'Completed',
        ]);


        // ============================================================
        // CLIENT ADMIN: user-03 (Rizal Firmansyah - Nusantara Tech Startup)
        // ============================================================
        $companyId = 'user-03';

        Project::updateOrCreate(['id' => 'proj-nt01'], [
            'id' => 'proj-nt01',
            'name' => 'Nusantara MVP Launch',
            'description' => 'Rekrutmen tim inti untuk peluncuran MVP produk fintech.',
            'status' => 'Active',
            'owner_id' => 'int01',
            'company_id' => $companyId,
            'created_date' => '2026-06-15T10:00:00Z',
        ]);

        Requisition::updateOrCreate(['id' => 'req-nt01'], [
            'id' => 'req-nt01', 'title' => 'Frontend Engineer (Vue.js)',
            'department' => 'Engineering', 'location' => 'Yogyakarta (Hybrid)',
            'employment_type' => 'Full-time', 'headcount' => 2,
            'experience_level' => 'Mid-level',
            'salary_min' => 10000000, 'salary_max' => 16000000,
            'deadline' => '2026-10-31', 'status' => 'Approved',
            'job_id' => 'job-nt01', 'company_id' => $companyId,
        ]);
        Requisition::updateOrCreate(['id' => 'req-nt02'], [
            'id' => 'req-nt02', 'title' => 'Data Engineer',
            'department' => 'Data', 'location' => 'Remote',
            'employment_type' => 'Full-time', 'headcount' => 1,
            'experience_level' => 'Senior',
            'salary_min' => 18000000, 'salary_max' => 28000000,
            'deadline' => '2026-11-30', 'status' => 'Approved',
            'job_id' => 'job-nt02', 'company_id' => $companyId,
        ]);

        Job::updateOrCreate(['id' => 'job-nt01'], [
            'id' => 'job-nt01', 'title' => 'Frontend Engineer (Vue.js)',
            'department' => 'Engineering', 'level' => 'Mid-level',
            'location' => 'Yogyakarta (Hybrid)', 'status' => 'Open',
            'employment_type' => 'Full-time', 'total_applicants' => 2,
            'days_open' => 10, 'salary_min' => 10000000, 'salary_max' => 16000000,
            'deadline' => '2026-10-31', 'project_id' => 'proj-nt01',
            'company_id' => $companyId,
            'job_description' => 'Bergabung dengan tim frontend Nusantara Tech untuk membangun dashboard fintech menggunakan Vue 3 dan Nuxt.',
            'competencies' => ['Vue.js', 'Nuxt', 'TypeScript', 'TailwindCSS', 'REST API'],
        ]);
        Job::updateOrCreate(['id' => 'job-nt02'], [
            'id' => 'job-nt02', 'title' => 'Data Engineer',
            'department' => 'Data', 'level' => 'Senior',
            'location' => 'Remote', 'status' => 'Open',
            'employment_type' => 'Full-time', 'total_applicants' => 1,
            'days_open' => 5, 'salary_min' => 18000000, 'salary_max' => 28000000,
            'deadline' => '2026-11-30', 'project_id' => 'proj-nt01',
            'company_id' => $companyId,
            'job_description' => 'Design dan maintain data pipeline untuk produk analitik keuangan kami.',
            'competencies' => ['Python', 'Apache Spark', 'Airflow', 'BigQuery', 'SQL'],
        ]);

        Candidate::updateOrCreate(['id' => 'cand-nt01'], [
            'id' => 'cand-nt01', 'name' => 'Fajar Ramadhan',
            'avatar_url' => 'https://picsum.photos/seed/fajar/100',
            'email' => 'fajar.r@example.com', 'phone' => '+6281300001111',
            'experience_years' => 3, 'expected_salary' => 14000000,
            'skills' => 'Vue.js, Nuxt, TailwindCSS, JavaScript, Git',
            'major' => 'Teknik Informatika',
        ]);
        Candidate::updateOrCreate(['id' => 'cand-nt02'], [
            'id' => 'cand-nt02', 'name' => 'Indah Permata',
            'avatar_url' => 'https://picsum.photos/seed/indah/100',
            'email' => 'indah.p@example.com', 'phone' => '+6281300002222',
            'experience_years' => 4, 'expected_salary' => 15000000,
            'skills' => 'Vue.js, React, TypeScript, SASS, Storybook',
            'major' => 'Desain Komunikasi Visual',
        ]);
        Candidate::updateOrCreate(['id' => 'cand-nt03'], [
            'id' => 'cand-nt03', 'name' => 'Wahyu Hidayat',
            'avatar_url' => 'https://picsum.photos/seed/wahyu/100',
            'email' => 'wahyu.h@example.com', 'phone' => '+6281300003333',
            'experience_years' => 7, 'expected_salary' => 26000000,
            'skills' => 'Python, Apache Spark, Airflow, BigQuery, dbt, SQL',
            'major' => 'Statistika',
        ]);

        Application::updateOrCreate(['id' => 'app-nt01'], [
            'id' => 'app-nt01', 'candidate_id' => 'cand-nt01', 'job_id' => 'job-nt01',
            'company_id' => $companyId, 'stage_id' => 'interview',
            'applied_date' => '2026-08-25T09:00:00Z', 'source' => 'LinkedIn', 'total_score' => 80,
            'scorecard' => [['name'=>'Technical','weight'=>0.5,'score'=>78],['name'=>'Culture Fit','weight'=>0.3,'score'=>85],['name'=>'Communication','weight'=>0.2,'score'=>80]],
        ]);
        Application::updateOrCreate(['id' => 'app-nt02'], [
            'id' => 'app-nt02', 'candidate_id' => 'cand-nt02', 'job_id' => 'job-nt01',
            'company_id' => $companyId, 'stage_id' => 'assessment',
            'applied_date' => '2026-08-27T11:00:00Z', 'source' => 'Career Site', 'total_score' => 83,
        ]);
        Application::updateOrCreate(['id' => 'app-nt03'], [
            'id' => 'app-nt03', 'candidate_id' => 'cand-nt03', 'job_id' => 'job-nt02',
            'company_id' => $companyId, 'stage_id' => 'screening',
            'applied_date' => '2026-09-02T08:00:00Z', 'source' => 'Referral', 'total_score' => 91,
        ]);

        Interview::updateOrCreate(['id' => 'iv-nt01'], [
            'id' => 'iv-nt01', 'application_id' => 'app-nt01', 'type' => 'Technical Interview',
            'date_time' => '2026-09-10T14:00:00Z',
            'interviewers' => [['id'=>'int01','name'=>'Alex Greene','role'=>'Hiring Manager']],
            'location_or_link' => 'https://meet.google.com/nt-int-01', 'status' => 'Scheduled',
        ]);

        Task::updateOrCreate(['id' => 'task-nt01'], [
            'id' => 'task-nt01', 'application_id' => 'app-nt02',
            'title' => 'Kirim link assessment Vue.js ke Indah', 'due_date' => '2026-09-08',
            'assignee_id' => 'int06', 'status' => 'To Do',
        ]);


        // ============================================================
        // CLIENT ADMIN: user-04 (Kevin Pratama - Global Innovations Ltd)
        // ============================================================
        $companyId = 'user-04';

        Project::updateOrCreate(['id' => 'proj-gi01'], [
            'id' => 'proj-gi01',
            'name' => 'Global AI Research Team',
            'description' => 'Membangun tim riset AI/ML untuk produk analitik prediktif.',
            'status' => 'Active',
            'owner_id' => 'int05',
            'company_id' => $companyId,
            'created_date' => '2026-07-20T10:00:00Z',
        ]);

        Requisition::updateOrCreate(['id' => 'req-gi01'], [
            'id' => 'req-gi01', 'title' => 'Machine Learning Engineer',
            'department' => 'AI/ML', 'location' => 'Bandung (Hybrid)',
            'employment_type' => 'Full-time', 'headcount' => 1,
            'experience_level' => 'Senior',
            'salary_min' => 20000000, 'salary_max' => 35000000,
            'deadline' => '2026-11-15', 'status' => 'Approved',
            'job_id' => 'job-gi01', 'company_id' => $companyId,
        ]);

        Job::updateOrCreate(['id' => 'job-gi01'], [
            'id' => 'job-gi01', 'title' => 'Machine Learning Engineer',
            'department' => 'AI/ML', 'level' => 'Senior',
            'location' => 'Bandung (Hybrid)', 'status' => 'Open',
            'employment_type' => 'Full-time', 'total_applicants' => 1,
            'days_open' => 12, 'salary_min' => 20000000, 'salary_max' => 35000000,
            'deadline' => '2026-11-15', 'project_id' => 'proj-gi01',
            'company_id' => $companyId,
            'job_description' => 'Riset dan deployment model ML untuk prediksi perilaku pelanggan.',
            'competencies' => ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'SQL', 'Statistics'],
        ]);

        Candidate::updateOrCreate(['id' => 'cand-gi01'], [
            'id' => 'cand-gi01', 'name' => 'Galih Prasetyo',
            'avatar_url' => 'https://picsum.photos/seed/galih/100',
            'email' => 'galih.p@example.com', 'phone' => '+6281400001111',
            'experience_years' => 5, 'expected_salary' => 30000000,
            'skills' => 'Python, TensorFlow, PyTorch, Scikit-learn, MLOps, Docker',
            'major' => 'Ilmu Komputer (S2)',
        ]);

        Application::updateOrCreate(['id' => 'app-gi01'], [
            'id' => 'app-gi01', 'candidate_id' => 'cand-gi01', 'job_id' => 'job-gi01',
            'company_id' => $companyId, 'stage_id' => 'interview',
            'applied_date' => '2026-08-30T10:00:00Z', 'source' => 'LinkedIn', 'total_score' => 90,
            'scorecard' => [['name'=>'ML Knowledge','weight'=>0.5,'score'=>92],['name'=>'Engineering','weight'=>0.3,'score'=>88],['name'=>'Communication','weight'=>0.2,'score'=>85]],
        ]);

        Interview::updateOrCreate(['id' => 'iv-gi01'], [
            'id' => 'iv-gi01', 'application_id' => 'app-gi01', 'type' => 'Technical Interview',
            'date_time' => '2026-09-12T14:00:00Z',
            'interviewers' => [['id'=>'int05','name'=>'Edward King','role'=>'Product Manager']],
            'location_or_link' => 'https://meet.google.com/gi-ml-01', 'status' => 'Scheduled',
        ]);

        Task::updateOrCreate(['id' => 'task-gi01'], [
            'id' => 'task-gi01', 'application_id' => 'app-gi01',
            'title' => 'Review ML portfolio Galih', 'due_date' => '2026-09-11',
            'assignee_id' => 'int05', 'status' => 'To Do',
        ]);


        // ============================================================
        // CLIENT ADMIN: user-05 (Tiara Dewi - Fintech Prima Indonesia)
        // ============================================================
        $companyId = 'user-05';

        Project::updateOrCreate(['id' => 'proj-fp01'], [
            'id' => 'proj-fp01',
            'name' => 'Fintech Prima Digital Banking',
            'description' => 'Rekrutmen tim untuk membangun platform digital banking baru.',
            'status' => 'Active',
            'owner_id' => 'int01',
            'company_id' => $companyId,
            'created_date' => '2026-08-01T10:00:00Z',
        ]);

        Requisition::updateOrCreate(['id' => 'req-fp01'], [
            'id' => 'req-fp01', 'title' => 'Backend Engineer (Go)',
            'department' => 'Engineering', 'location' => 'Jakarta',
            'employment_type' => 'Full-time', 'headcount' => 2,
            'experience_level' => 'Mid-level',
            'salary_min' => 14000000, 'salary_max' => 22000000,
            'deadline' => '2026-10-31', 'status' => 'Approved',
            'job_id' => 'job-fp01', 'company_id' => $companyId,
        ]);
        Requisition::updateOrCreate(['id' => 'req-fp02'], [
            'id' => 'req-fp02', 'title' => 'Compliance Officer',
            'department' => 'Legal & Compliance', 'location' => 'Jakarta',
            'employment_type' => 'Full-time', 'headcount' => 1,
            'experience_level' => 'Senior',
            'salary_min' => 18000000, 'salary_max' => 28000000,
            'deadline' => '2026-11-15', 'status' => 'Pending',
            'company_id' => $companyId,
        ]);

        Job::updateOrCreate(['id' => 'job-fp01'], [
            'id' => 'job-fp01', 'title' => 'Backend Engineer (Go)',
            'department' => 'Engineering', 'level' => 'Mid-level',
            'location' => 'Jakarta', 'status' => 'Open',
            'employment_type' => 'Full-time', 'total_applicants' => 2,
            'days_open' => 8, 'salary_min' => 14000000, 'salary_max' => 22000000,
            'deadline' => '2026-10-31', 'project_id' => 'proj-fp01',
            'company_id' => $companyId,
            'job_description' => 'Membangun microservices backend menggunakan Go untuk platform digital banking.',
            'competencies' => ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
        ]);

        Candidate::updateOrCreate(['id' => 'cand-fp01'], [
            'id' => 'cand-fp01', 'name' => 'Hendri Saputra',
            'avatar_url' => 'https://picsum.photos/seed/hendri/100',
            'email' => 'hendri.s@example.com', 'phone' => '+6281500001111',
            'experience_years' => 4, 'expected_salary' => 20000000,
            'skills' => 'Go, gRPC, PostgreSQL, Redis, Docker, Kubernetes',
            'major' => 'Teknik Informatika',
        ]);
        Candidate::updateOrCreate(['id' => 'cand-fp02'], [
            'id' => 'cand-fp02', 'name' => 'Lina Marlina',
            'avatar_url' => 'https://picsum.photos/seed/lina/100',
            'email' => 'lina.m@example.com', 'phone' => '+6281500002222',
            'experience_years' => 3, 'expected_salary' => 16000000,
            'skills' => 'Go, Node.js, MySQL, REST API, Git',
            'major' => 'Ilmu Komputer',
        ]);

        Application::updateOrCreate(['id' => 'app-fp01'], [
            'id' => 'app-fp01', 'candidate_id' => 'cand-fp01', 'job_id' => 'job-fp01',
            'company_id' => $companyId, 'stage_id' => 'assessment',
            'applied_date' => '2026-09-01T09:00:00Z', 'source' => 'LinkedIn', 'total_score' => 84,
            'scorecard' => [['name'=>'Technical','weight'=>0.5,'score'=>86],['name'=>'Experience','weight'=>0.3,'score'=>82],['name'=>'Culture','weight'=>0.2,'score'=>80]],
        ]);
        Application::updateOrCreate(['id' => 'app-fp02'], [
            'id' => 'app-fp02', 'candidate_id' => 'cand-fp02', 'job_id' => 'job-fp01',
            'company_id' => $companyId, 'stage_id' => 'applied',
            'applied_date' => '2026-09-05T11:00:00Z', 'source' => 'Career Site', 'total_score' => 72,
        ]);

        Task::updateOrCreate(['id' => 'task-fp01'], [
            'id' => 'task-fp01', 'application_id' => 'app-fp01',
            'title' => 'Kirim coding test Go ke Hendri', 'due_date' => '2026-09-10',
            'assignee_id' => 'int06', 'status' => 'To Do',
        ]);
    }
}
